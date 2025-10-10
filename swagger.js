const express = require('express');
const swaggergen = require('swagger-autogen')();

//host: 'moroni-quest.onrender.com',
const doc = {
    info: {
        title: 'Moroni\'s Quest Application',
        description: 'Moroni\'s Quest application for the Sherwood Park, Alberta stake.'
    },
    host: 'localhost:3000',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggergen(outputFile, endpointsFiles, doc);