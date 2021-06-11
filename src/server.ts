import express from 'express'

class App {
    public express:express.Application
    /*
      Construcor
    */
    public constructor () {
    	this.express = express()
    	this.middleware()
    }

    private middleware () {
    	this.express.use(express.json())
    }
}

export default new App().express
