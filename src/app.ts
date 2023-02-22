import config from 'config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'





const HTTP_PORT = config.get('http_port')
const HTTPS_PORT = config.get('https_port')

const app = express()

app.use(express.json())
app.use(cookieParser())
