const http = require("http");
const Io = require("./io/io");
const Todos = new Io("./db/todos.json");
const Todo = require("./modules/todo");
const bodyParser = require("./io/parser");
const server = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/todos" && req.method === "GET") {
    try {
      const todos = await Todos.read();
      res.writeHead(200).end(JSON.stringify(todos));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify(error));
    }
  } else if (req.url === "/add_todo" && req.method === "POST") {
    try {
      const todos = await Todos.read();
      req.body = await bodyParser(req);
      const { text, title } = req.body;
      const id = (todos[todos.length - 1]?.id || 0) + 1;
      const date = new Date();
      const isComplete = "proccess";
      const newTodo = new Todo(title, id, text, date, isComplete);
      const data = todos ? [...todos, newTodo] : [newTodo];
      Todos.write(data);
      res.writeHead(201).end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify(error));
    }
  } else if (req.url === "/delete_todo" && req.method === "DELETE") {
    try {
      const todos = await Todos.read();
      req.body = await bodyParser(req);
      const { id } = req.body;
      const newTodos = todos.filter((t) => t.id !== id);
      Todos.write(newTodos);
      res.writeHead(200).end(JSON.stringify({ message: "Todo deleted" }));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify(error));
    }
  }
};
http.createServer(server).listen(4000);
