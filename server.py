from flask import Flask, request, render_template, send_from_directory
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS
from datetime import datetime
import logging

app = Flask(__name__, static_url_path='/examples', static_folder='examples')

logging.basicConfig(filename='record.log', level=logging.WARNING, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
logging.getLogger("werkzeug").setLevel('WARNING')
logging.getLogger("server").setLevel('WARNING')

# CORS(app)

app.config['SECRET_KEY'] = 'secret!'
app.config['EXAMPLES_STATIC_PATH'] = 'examples/'
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}
cur_room = None

# @app.route('/', defaults={'file': 'index.html'})
# @app.route('/<path:file>')
# @app.route('/examples/<path:file>')
# def serve_results(file):
#     app.logger.info(file)
#     # Haven't used the secure way to send files yet
#     return send_from_directory(app.config['EXAMPLES_STATIC_PATH'], file)
ice_servers = [{'url':'stun:stun.l.google.com:19302'},
{"url":'stun:stun1.l.google.com:19302'},
{"url":'stun:stun2.l.google.com:19302'},
{"url":'stun:stun3.l.google.com:19302'},
{"url":'stun:stun4.l.google.com:19302'},];

clients = {}

@socketio.on('connect')
def connect():
    app.logger.warning(f'{request.sid} CONNECTED')

@socketio.on('joinRoom')
def on_join(data):
    global cur_room
    global rooms
    global clients

    room = data['room']
    app.logger.info(f"room: {room}")

    if not rooms.get(room):
        rooms[room] = {
            'name': room,
            'occupants': {},
        }

    joined_time = str(datetime.now())
    rooms[room]['occupants'][request.sid] = joined_time;
    cur_room = room

    app.logger.info(f'{request.sid} joined room {room}')
    join_room(room)

    emit("connectSuccess", { 'joinedTime': joined_time })
    occupants = rooms[room]['occupants']

    emit("occupantsChanged", {'occupants': occupants}, room=cur_room)

    # app.logger.warning(f'EMIT INTRODUCTION: {request.sid}')
    # emit("introduction", [request.sid, len(occupants), list(occupants.keys()), ice_servers])
    # app.logger.warning(f'EMIT NEW USER CONNECTED: {request.sid} to room {data["room"]}')
    # emit("newUserConnected", [len(occupants), request.sid, list(occupants.keys())])

@socketio.on('ice-me')
def on_ice_me(data):
    global cur_room
    global rooms
    occupants = rooms[data["room"]]['occupants']
    #app.logger.info("Connecting: " + str(data))
    ### WebRTC hook-up
    app.logger.warning(f'EMIT INTRODUCTION: {request.sid}')
    emit("introduction", [request.sid, len(occupants), list(occupants.keys()), ice_servers])
    app.logger.warning(f'EMIT NEW USER CONNECTED: {request.sid} to room {data["room"]}')
    emit("newUserConnected", [len(occupants), request.sid, list(occupants.keys())], room=cur_room)

@socketio.on('send')
def on_send(data):
    app.logger.info("Sending: " + str(data))
    socketio.emit("send", data, room=data["to"])


@socketio.on('broadcast')
def on_broadcast(data):
    app.logger.info("Broadcasting: " + str(data))
    emit("send", data, broadcast=True)


@socketio.on('disconnect')
def on_disconnect():
    global rooms
    sid = request.sid
    app.logger.info(f'disconnected, id:{sid} room:{cur_room}' )
    if rooms.get(cur_room):
        app.logger.info(f'user disconnected, id: {sid}' )
        rooms[cur_room]['occupants'].pop(sid)
        occupants = rooms[cur_room]['occupants']
        emit("occupantsChanged", {'occupants': occupants}, room=cur_room, broadcast=True)
        app.logger.info(f'current occupants: {occupants}')

        if len(occupants) == 0:
            app.logger.info('everybody left the room')
            try:
                rooms.pop(cur_room)
            except KeyError:
                app.logger.info(f'Room {cur_room} already closed')

        # WebRTC
        emit("userDisconnected", [len(occupants), request.sid, list(occupants.keys())])

@socketio.on("call-user")
def call_user(data):
    app.logger.info("Server forwarding call from %s to %s"%(request.sid, data["to"]))
    socketio.emit("call-made", {"socket":request.sid, "offer": data["offer"]}, room=data["to"])

@socketio.on("make-answer")
def make_answer(data):
    app.logger.info("%s answering %s"%(request.sid, data["to"]))
    socketio.emit("answer-made", {"socket":request.sid, "answer": data["answer"]}, room=data["to"])

@socketio.on("reject-call")
def reject_call(data):
    app.logger.info("Rejecting call from %s to %s"%(data['from'], request.sid))
    socketio.emit("call-rejected", {"socket":request.sid}, room=data["to"])

# ICEsetup

@socketio.on("addIceCandidate")
def add_ice_candidate(data):
    app.logger.warning("Ice candidate found [ %s ] for %s"%(data['candidate'], request.sid))
    socketio.emit("iceCandidateFound", {"socket":request.sid, "candidate": data["candidate"]}, room=data["to"])

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8080)
