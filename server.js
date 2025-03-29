const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DB_FILE = "db.json";

app.use(cors());
app.use(express.json());

// Get 
app.get("/items", (req, res) => {
    fs.readFile(DB_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading data" });
        res.json(JSON.parse(data));
    });
});

// Add data
app.post("/items", (req, res) => {
    fs.readFile(DB_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading data" });
        
        const items = JSON.parse(data);
        const newItem = { id: Date.now(), ...req.body };
        items.push(newItem);
        
        fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ message: "Error writing data" });
            res.status(201).json(newItem);
        });
    });
});

// Update 
app.put("/items/:id", (req, res) => {
    fs.readFile(DB_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading data" });
        
        const items = JSON.parse(data);
        const index = items.findIndex((item) => item.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: "Item not found" });
        
        items[index] = { ...items[index], ...req.body };
        
        fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ message: "Error writing data" });
            res.json(items[index]);
        });
    });
});

// Delete 
app.delete("/items/:id", (req, res) => {
    fs.readFile(DB_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading data" });
        
        const items = JSON.parse(data).filter((item) => item.id != req.params.id);
        
        fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ message: "Error writing data" });
            res.json({ message: "Item deleted" });
        });
    });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));