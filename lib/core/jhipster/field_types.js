'use strict';

const Set = require('../../utils/objects/set'),
    _ = require('lodash'),
    _v = require('./validations'),
    JDLEnum = require('../jdl_enum'),
    VALIDATIONS = _v.VALIDATIONS,
    buildException = require('../../exceptions/exception_factory').buildException,
    exceptions = require('../../exceptions/exception_factory').exceptions;

const SQL_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Float',
  ENUM: 'Enum',
  BOOLEAN: 'Boolean',
  LOCAL_DATE: 'LocalDate',
  ZONED_DATE_TIME: 'ZonedDateTime',
  BLOB: 'Blob',
  ANY_BLOB: 'AnyBlob',
  IMAGE_BLOB: 'ImageBlob'
};

const SQL_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Enum: new Set([VALIDATIONS.REQUIRED]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  LocalDate: new Set([VALIDATIONS.REQUIRED]),
  ZonedDateTime: new Set([VALIDATIONS.REQUIRED]),
  Blob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  AnyBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  ImageBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES])
};

const MONGODB_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Float',
  ENUM: 'Enum',
  BOOLEAN: 'Boolean',
  LOCAL_DATE: 'LocalDate',
  ZONED_DATE_TIME: 'ZonedDateTime',
  BLOB: 'Blob',
  ANY_BLOB: 'AnyBlob',
  IMAGE_BLOB: 'ImageBlob'
};

const MONGODB_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Enum: new Set([VALIDATIONS.REQUIRED]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  LocalDate: new Set([VALIDATIONS.REQUIRED]),
  ZonedDateTime: new Set([VALIDATIONS.REQUIRED]),
  Blob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  AnyBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  ImageBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES])
};

const CASSANDRA_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Float',
  BOOLEAN: 'Boolean',
  DATE: 'Date',
  UUID: 'UUID'
};

const CASSANDRA_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  Date: new Set([VALIDATIONS.REQUIRED]),
  UUID: new Set([VALIDATIONS.REQUIRED])
};

function isSQLType(type) {
  if (!type) {
    throw new buildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in SQL_TYPES) || type instanceof JDLEnum;
}

function isMongoDBType(type) {
  if (!type) {
    throw new buildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in MONGODB_TYPES) || type instanceof JDLEnum;
}

function isCassandraType(type) {
  if (!type) {
    throw new buildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in CASSANDRA_TYPES) && !(type instanceof JDLEnum);
}

function hasValidation(type, validation) {
  if (!type || !validation) {
    throw new buildException(exceptions.NullPointer, 'The passed type and value must not be nil.');
  }
  return (isSQLType(type) && SQL_VALIDATIONS[type].has(validation))
      || (isMongoDBType(type) && MONGODB_VALIDATIONS[type].has(validation))
      || (isCassandraType(type) && CASSANDRA_VALIDATIONS[type].has(validation));
}

module.exports = {
  SQL_TYPES: SQL_TYPES,
  MONGODB_TYPES: MONGODB_TYPES,
  CASSANDRA_TYPES: CASSANDRA_TYPES,
  isSQLType: isSQLType,
  isMongoDBType: isMongoDBType,
  isCassandraType: isCassandraType,
  hasValidation: hasValidation
};
