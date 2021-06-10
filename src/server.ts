
import express from 'express'

class App {
    public express:express.Application

    /*
      Construcor
    */
    public constror () {
    	this.express = express()
    }
}

export default new App().express
