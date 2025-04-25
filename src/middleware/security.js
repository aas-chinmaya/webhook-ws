const helmet = require('helmet');
const cors = require('cors');
const express = require('express');

const securityMiddleware = [
    helmet(),
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST']
    }),
    express.json({ limit: '10mb' }),
    express.urlencoded({ extended: true, limit: '10mb' })
];

module.exports = securityMiddleware;