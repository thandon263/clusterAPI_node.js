'use strict';

const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length;
const express = require('express')

var app = express()

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running!`)
	
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork()
	}

	// check if work id is dead
	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker ${process.pid} died!`)
	})
} else {
	// These worker can share any TCP connection
	// It will be initialized using express
	console.log(`Worker ${process.pid} started`)
	
	app.get('/cluster', (req, res) => {
		let worker = cluster.worker.id
		res.send(`Running on worker with id ==> ${worker}`)
	})

	app.listen(3000, function () {
		console.log('Your node app is running on port 3000')
	})
}
