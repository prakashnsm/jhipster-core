'use strict';

const fs = require('fs'),
    pegjsParser = require('../dsl/pegjs_parser'),
    buildException = require('../exceptions/exception_factory').buildException,
    exceptions = require('../exceptions/exception_factory').exceptions;

module.exports = {
  read: readContent,
  readFiles: readFiles,
  checkFileIsJDLFile: checkFileIsJDLFile
};

function readFiles(files) {
  if (!files || files.length === 0) {
    throw new buildException(
        exceptions.IllegalArgument, 'The file/s must be passed.');
  }
  checkAllTheFilesAreJDLFiles(files);
  return readContent(files.length === 1
      ? readFileContent(files[0])
      : aggregateFiles(files));
}

function readContent(content) {
  if (!content || content.length === 0) {
    throw new buildException(
        exceptions.IllegalArgument, 'The content must be passed.');
  }
  return pegjsParser.parse(filterJDLDirectives(content));
}

function checkAllTheFilesAreJDLFiles(files) {
  for (let i = 0; i < files.length; i++) {
    checkFileIsJDLFile(files[i]);
  }
}

function checkFileIsJDLFile(file) {
  if (file.slice(file.length - 3, file.length) !== '.jh'
      && file.slice(file.length - 4, file.length) !== '.jdl') {
    throw new buildException(
        exceptions.WrongFile,
        `The passed file '${file}' must end with '.jh' or '.jdl' to be valid.`);
  }
}

function aggregateFiles(files) {
  var content = '';
  for (let i = 0; i < files.length; i++) {
    content = content + '\n' + readFileContent(files[i]);
  }
  return content;
}

function readFileContent(file) {
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    throw new buildException(
        exceptions.WrongFile,
        `The passed file '${file}' must exist and must not be a directory.`);
  }
  return fs.readFileSync(file, 'utf-8').toString();
}

function filterJDLDirectives(content){
  return content.replace(/^\u0023.*\n?/mg,'');
}
