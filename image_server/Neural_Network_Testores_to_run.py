import numpy as np
import scipy as sc
from matplotlib import pyplot as plt
import pandas as pd

import time
from IPython.display import clear_output

import cv2
re_train = True
#Funciones y clases
#Capa neuronal

class neural_layer():

  def __init__(self, n_conn, n_neur):

    self.b = np.random.rand(1,n_neur) * 2 -1
    self.W = np.random.rand(n_conn,n_neur) * 2 -1

#Estructuración de la red
def create_neural_network(topology):

  nn = []

  for l, layer in enumerate(topology[:-1]):
    nn.append(neural_layer(topology[l],topology[l+1]))
  return nn
#Funciones de activación
def relu(x):
  return np.maximum(0,x)

def sigmoid(x):
  return (1/(1+ np.e ** (-x)))

def der_sigmoid(x):
  return (sigmoid(x) * (1-sigmoid(x)))
def cost(predicted, real):
  return np.mean((real-predicted)**2)
def der_cost(predicted,real):
  return(predicted-real)

#función de entrenamiento o predicción
def train(neural_net, x_values, labels, lr = 0.001, train = True):

  out = [(None, x_values)]
  #Forward Pass

  for l, layer in enumerate(neural_net):

    z = out[-1][1] @ neural_net[l].W + neural_net[l].b
    a = sigmoid(z)
    out.append((z,a))

  #print(l2_cost[0](out[-1][1],Y))

  if train:

    #Backward pass
    deltas = []

    for l in reversed(range(0, len(neural_net))):

      z = out[l+1][0]
      a = out[l+1][1]

      if l == len(neural_net) - 1:
        #Calcular delta de la ultima capa
        deltas.insert(0,der_cost(a,labels)* der_sigmoid(a))
        #print("not out of bounds")
      else:
        #Calcular delta respecto a capa previa
        deltas.insert(0,deltas[0] @ _W.T * der_sigmoid(a))

      _W = neural_net[l].W

      #Gradeint Descent
      neural_net[l].b = neural_net[l].b - np.mean(deltas[0], axis=0, keepdims = True)*lr
      neural_net[l].W = neural_net[l].W - out[l][1].T @ deltas[0] * lr

  return out[-1][1], neural_net

#Variables de inicio
T_1 = np.array([247, 249, 228, 231, 245, 129, 200, 243, 236, 242, 135, 156, 207, 237])

p = len(T_1)

topology = [p,512,128,512,128,64,2]

neural_n = create_neural_network(topology)


data = pd.read_csv("/home/eddy/Descargas/db.csv", delimiter = " ", dtype = np.float64).to_numpy()

data = data[:,0:266]
labels = data[:,256:266]
zero = np.array([1,0,0,0,0,0,0,0,0,0])
one = np.array([0,1,0,0,0,0,0,0,0,0])
zero_vector = []
one_vector = []
whole_vector = []
true_labels = []
for i in range(0, len(data)):
    if(sum(labels[i] == zero) ==10):
        zero_vector.append(data[i])
        whole_vector.append(data[i])
        true_labels.append([1,0])
    elif(sum(labels[i] == one) ==10):
        one_vector.append(data[i])
        whole_vector.append(data[i])
        true_labels.append([0,1])

testor_data = []
for i in range(0,len(whole_vector)):
    for element in T_1:
        testor_data.append([whole_vector[i][element]])

testor_data=np.reshape(np.asarray(testor_data),(len(whole_vector),14))
whole_vector=np.asarray(whole_vector)

# Proceso de entrenamiento
loss = []

train_values = testor_data[:161][:]
train_labels = true_labels[:161][:]

para_predecir = testor_data[162][:]
if(re_train):
    for i in  range(200):

      pY,neural_n = train(neural_n, train_values, train_labels, lr = 0.001)
      if i%25 == 0:
        prediction = train(neural_n, para_predecir, train_labels, lr = 0.05, train = False)
        print(prediction[0])

    #Prorcentaje de aciertos
    count = 0
    for i in range(162,322):
      para_predecir = testor_data[i][:]
      prediction = train(neural_n, para_predecir, labels, lr = 0.01, train = False)
      index = np.argmax(np.asarray(prediction[0]))
      if(true_labels[i][index] == 1):
        count = count +1
    print(count/161)


#Predicción neta

plt.rcParams['image.cmap'] = 'gray'
im = cv2.imread("/home/eddy/Descargas/zero.png",1)
gray_img=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
gray_img = cv2.resize(gray_img,(16,16))
# plt.imshow(gray_img)
# plt.show()
first_try = (np.reshape(gray_img, (1,256))==255)*1

test_1=[]
for element in T_1:
        test_1.append([first_try[0][element]])

test_1 = np.reshape(np.asarray(test_1),14)
print(test_1)

prediction = train(neural_n, test_1, labels, lr = 0.01, train = False)
print(prediction[0][0][0])
