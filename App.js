
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem(
        'myTasks',
        JSON.stringify(newTasks)
      );
      setTasks(newTasks);
    } catch (error) {
      console.log('Error saving tasks:', error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('myTasks');

        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.log('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  const addTask = () => {
    if (task.trim() === '') {
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task.trim()
    };

    saveTasks([...tasks, newTask]);
    setTask('');
  };

  const editTask = (item) => {
    setTask(item.title);
    setEditId(item.id);
  };

  const updateTask = () => {
    if (task.trim() === '') {
      return;
    }

    const updatedTasks = tasks.map((item) =>
      item.id === editId
        ? { ...item, title: task.trim() }
        : item
    );

    saveTasks(updatedTasks);
    setTask('');
    setEditId(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(
      (item) => item.id !== id
    );

    saveTasks(updatedTasks);

    if (editId === id) {
      setTask('');
      setEditId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <Text style={styles.subtitle}>Manage your daily tasks</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={editId ? updateTask : addTask}
        >
          <Text style={styles.buttonText}>
            {editId ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      {editId !== null && (
        <TouchableOpacity
          onPress={() => {
            setTask('');
            setEditId(null);
          }}
        >
          <Text style={styles.cancelText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editTask(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#344B3A',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#344B3A',
    padding: 15,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#82977A',
    padding: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#C65B5B',
    padding: 10,
    borderRadius: 6,
  },
  cancelText: {
    color: '#777',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
});
