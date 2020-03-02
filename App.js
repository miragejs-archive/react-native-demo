import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { Server, Model, Factory } from "miragejs";
import faker from "faker";

if (window.server) {
  server.shutdown();
}

window.server = new Server({
  models: {
    user: Model
  },
  factories: {
    user: Factory.extend({
      name() {
        return faker.name.findName();
      },
      avatarUrl(i) {
        let c = i % 2 ? "men" : "women";
        return `https://randomuser.me/api/portraits/${c}/${i}.jpg`;
      },
      title() {
        return faker.name.title();
      }
    })
  },
  seeds(server) {
    server.createList("user", 25);
  },
  routes() {
    this.get("/api/users", schema => {
      return schema.users.all();
    });
  }
});

const App = () => {
  let [users, setUsers] = useState([]);
  let [serverError, setServerError] = useState();

  useEffect(() => {
    let fetchUsers = async () => {
      try {
        let res = await fetch("/api/users");
        let data = await res.json();
        setUsers(data.users);
      } catch (error) {
        setServerError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {serverError ? (
        <Text testID="server-error">{serverError}</Text>
      ) : users.length === 0 ? (
        <Text testID="no-users">No users!</Text>
      ) : (
        <View>
          {users.map(user => (
            <ListItem
              testId={`user-${user.id}`}
              key={user.id}
              leftAvatar={{ source: { uri: user.avatarUrl } }}
              title={user.name}
              subtitle={user.title}
              bottomDivider
              chevron
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
