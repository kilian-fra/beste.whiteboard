import socketio
import threading
import time
import random
from termcolor import colored

class WhiteboardClient:
    def __init__(self, url) -> None:
        self.sio = socketio.Client()
        self.url = url
        self._shape_array = []

        # Event handlers
        @self.sio.event
        def connect():
            self.on_connect()

        @self.sio.on('createShape')
        def shape_create(createdShape):
            self.handle_shape_create(createdShape)

        @self.sio.on('deleteShape')
        def shape_delete(shapeKey):
            self.handle_shape_delete(shapeKey)

        @self.sio.on('changeShape')
        def shape_change(changedShape):
            self.handle_shape_change(changedShape)

    @property
    def shape_array(self):
        return self._shape_array
    
    def handle_shape_change(self, changedShape):
        for i, shape in enumerate(self._shape_array):
            if shape.get('key') == changedShape.get('key'):
                self._shape_array[i] = changedShape
                break

    def handle_shape_create(self, createdShape):
        # convert created shape to python dict
        self._shape_array.append(createdShape)
    
    def handle_shape_delete(self, shapeKey):
        for shape in self._shape_array:
            if shape.get('key') == shapeKey:
                self._shape_array.remove(shape)
                return

    def connect(self):
        self.sio.connect(self.url)

    def disconnect(self):
        self.sio.disconnect()

    def emit_event(self, event_name, data, callback=None):
        self.sio.emit(event_name, data, callback=callback)
    
    def wait(self):
        self.sio.wait()
    
    def sleep(self, sec):
        self.sio.sleep(sec)

    def select_random_shape(self):
        if len(self._shape_array) > 0:
            random_shape = random.choice(self._shape_array)
            return random_shape
        else:
            return None
        
    def delete_random_shape(self):
        if len(self._shape_array) > 0:
            random_index = random.randint(0, len(self._shape_array) - 1)
            deleted_shape = self._shape_array.pop(random_index)
            return deleted_shape.get('key', None)
        else:
            return None

    def on_connect(self):
        self.emit_event("join-board", BOARD_TOKEN)

# Total simulation time in seconds
TEST_DURATION = 15

# Board token
BOARD_TOKEN = '34Q7XT7ITfz0ZF7n'

# socket io URL
URL = 'http://localhost:1337'

# Number of users for the simulation
NUM_USERS = 10

# Signal variable for threads
exit_simulation = False

array_of_clients = [None] * NUM_USERS

# Simulate the creation of a random shape object with random attributes (x, y, width & height)
def sim_create_shape(i):
    shapeType = random.randint(0, 5)

    shape_data = {
        'key': 'shape0',
        'type': 'rect',
        'x': random.randint(10, 800),
        'y': random.randint(10, 800),
        'color': 'black',
        'width': random.randint(10, 300),
        'height': random.randint(50, 400),
    }
    
    if shapeType == 1:
        shape_data['type'] = 'circle'
    elif shapeType == 2:
        shape_data['type'] = 'ellipse'
    elif shapeType == 3:
        shape_data['type'] = 'triangle'
    elif shapeType == 4:
        shape_data['type'] = 'arrow'
    elif shapeType == 5:
        shape_data['type'] = 'textfield'
        # add fontSize and text
        shape_data['fontSize'] = 12
        shape_data['text'] = 'Double click to edit text'


    array_of_clients[i].emit_event('createShape', {'boardToken': BOARD_TOKEN, 'shape': shape_data})

    print(f"[Client {i+1}] sim_create_shape")

def sim_process_test_results():
    result = True
    for i, a in enumerate(array_of_clients):
        for j, b in enumerate(array_of_clients):
            if i == j or i < j: continue
    
            for x in a.shape_array:
                for y in b.shape_array:
                    if x.get('key', None) != y.get('key', None): continue

                    flag = False

                    for key in x:
                        if x[key] != y[key]:
                            if not flag:
                                print(f"Difference between client {i+1} and client {j+1}:")
                                print(x.get('key', None))
                            flag = True
                            print(f"{key}: [{colored(x[key], 'red')}, {colored(y[key], 'green')}]")
                    if flag:
                        print("------------------------------------")

                result = False

    return result

def sim_change_shape_pos(i):

    # Select randome shape
    shape = array_of_clients[i].select_random_shape()
    if shape is None: return

    shape['x'] = random.randint(10, 800)
    shape['y'] = random.randint(10, 800)

    # emit chaned shape to server
    array_of_clients[i].emit_event('changeShape', {'boardToken': BOARD_TOKEN, 'changedShape': shape})

    print(f"[Client {i+1}] sim_change_shape_pos")

def sim_delete_shape(i):
    shape = array_of_clients[i].select_random_shape()
    if shape is None: return
    
    # emit delete shape to server
    array_of_clients[i].emit_event('deleteShape', {'boardToken': BOARD_TOKEN, 'shapeKey': shape['key']})

    print(f"[Client {i+1}] sim_delete_shape")

# Thread function, to simulate a whiteboard user
def simulate_user(i):
    print(f"[Client {i+1}] start simulation")

    # Init whiteboard client
    client = array_of_clients[i] = WhiteboardClient(URL)

    # Connect to socket io server and wait 2 seconds for the join-board event to be handled by the server
    # -> emit does not wait for the server to process our emited event 
    client.connect()
    time.sleep(2)

    # Testing
    sim_create_shape(i)
    sim_create_shape(i)
    sim_create_shape(i)

    # Run simulation until TIME_DURATION is reached
    while (exit_simulation == False):

        # Execute sim. operation based on conditions

        # Testing
        sim_change_shape_pos(i)

        time.sleep(0.1)

    time.sleep(3)

    # Terminate socket io connection and exit thread
    client.disconnect()  
    print(f"[Client {i+1}] exit simulation")

# Start simulation by creating NUM_USERS threads (each representing a user)
def start_simulation():
    for i in range(NUM_USERS):
        t = threading.Thread(target=simulate_user, args=(i,))
        t.start()

if __name__ == '__main__':

    print("[*] Starting simulation...\n\n")

    # Start simulation
    start_simulation()

    # Wait for TEST_DURATION (time for the simulation to run)
    time.sleep(TEST_DURATION)

    # Signal threads to terminate (exit loop and disconnect)
    exit_simulation = True

    # Wait for threads to exit
    for t in threading.enumerate():
        if t != threading.current_thread():
            t.join()

    print('*** Simulation results (start)***\n\n')

    if sim_process_test_results(): print("\n\033[92m[+] Simulation test passed -> no difference in clients shape objects")
    else: print("\n\033[91m[-] Simulation test not passed -> differences in clients shape objects")

    print("\033[0m")

    print('\n\n*** Simulation results (end)***\n\n')

    print("[*] Simulation over\n\n")