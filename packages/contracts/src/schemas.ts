// Explicit input schemas for the versioned application operations.
export const operationSchemas: Record<string, object> = {
  "admin.admin.getCompany": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listCompanies": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listEstablishments": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listCompanyInvitations": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.revokeCompanyInvitation": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.updateCompany": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "object",
            "additionalProperties": {
              "anyOf": [
                {
                  "type": "string",
                  "maxLength": 4000
                },
                {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 9007199254740991
                }
              ]
            }
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.setEstablishmentStatus": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "anyOf": [
              {
                "type": "string",
                "const": "ACTIVE"
              },
              {
                "type": "string",
                "const": "INACTIVE"
              }
            ]
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.setCompanyStatus": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "anyOf": [
              {
                "type": "string",
                "const": "ACTIVE"
              },
              {
                "type": "string",
                "const": "INACTIVE"
              }
            ]
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminCompanyPrices": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.upsertAdminCompanyPrice": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "companyId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "skuId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "amountMinor": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              }
            },
            "required": [
              "companyId",
              "skuId",
              "amountMinor"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.upsertAdminCompanyPrices": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "companyIds": {
                "type": "array",
                "maxItems": 1000,
                "items": {
                  "type": "string",
                  "maxLength": 4000,
                  "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                }
              },
              "skuId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "amountMinor": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              }
            },
            "required": [
              "companyIds",
              "skuId",
              "amountMinor"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.getCompanyOrderDetails": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminOrders": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string",
                "maxLength": 4000
              }
            ]
          }
        ],
        "minItems": 0,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.startOrderPicking": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listCompanyOrders": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string",
                "maxLength": 4000
              }
            ]
          }
        ],
        "minItems": 0,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listCompanyDrivers": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.assignCompanyOrderDriver": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.startCompanyOrderPicking": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.setOrderFinalPrices": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "array",
            "maxItems": 1000,
            "items": {
              "type": "object",
              "properties": {
                "skuId": {
                  "type": "string",
                  "maxLength": 4000,
                  "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                },
                "unitPriceMinor": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 9007199254740991
                }
              },
              "required": [
                "skuId",
                "unitPriceMinor"
              ],
              "additionalProperties": false
            }
          },
          {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string",
                "maxLength": 4000
              }
            ]
          }
        ],
        "minItems": 2,
        "maxItems": 3,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.advanceOrderStatus": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "anyOf": [
              {
                "type": "string",
                "const": "PICKING"
              },
              {
                "type": "string",
                "const": "READY_FOR_DISPATCH"
              },
              {
                "type": "string",
                "const": "DISPATCHED"
              },
              {
                "type": "string",
                "const": "DELIVERED"
              },
              {
                "type": "string",
                "const": "RECEIPT_CONFIRMED"
              }
            ]
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.createCompany": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "legalName": {
                "type": "string",
                "maxLength": 4000
              },
              "displayName": {
                "type": "string",
                "maxLength": 4000
              },
              "taxId": {
                "type": "string",
                "maxLength": 4000
              },
              "stateRegistration": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "corporateEmail": {
                "type": "string",
                "maxLength": 4000
              },
              "corporatePhone": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "fiscalAddressLine": {
                "type": "string",
                "maxLength": 4000
              },
              "fiscalAddressNumber": {
                "type": "string",
                "maxLength": 4000
              },
              "fiscalAddressComplement": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "fiscalDistrict": {
                "type": "string",
                "maxLength": 4000
              },
              "fiscalCity": {
                "type": "string",
                "maxLength": 4000
              },
              "fiscalState": {
                "type": "string",
                "maxLength": 4000
              },
              "fiscalPostalCode": {
                "type": "string",
                "maxLength": 4000
              },
              "legalRepresentativeName": {
                "type": "string",
                "maxLength": 4000
              },
              "legalRepresentativeEmail": {
                "type": "string",
                "maxLength": 4000
              },
              "legalRepresentativePhone": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "operationalContactName": {
                "type": "string",
                "maxLength": 4000
              },
              "operationalContactEmail": {
                "type": "string",
                "maxLength": 4000
              },
              "operationalContactPhone": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "paymentTermsDays": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 9007199254740991
                  }
                ]
              },
              "creditLimitMinor": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 9007199254740991
                  }
                ]
              }
            },
            "required": [
              "legalName",
              "displayName",
              "taxId",
              "corporateEmail",
              "fiscalAddressLine",
              "fiscalAddressNumber",
              "fiscalDistrict",
              "fiscalCity",
              "fiscalState",
              "fiscalPostalCode",
              "legalRepresentativeName",
              "legalRepresentativeEmail",
              "operationalContactName",
              "operationalContactEmail"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.createEstablishment": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "companyId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "address": {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "addressLine": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "addressNumber": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "addressComplement": {
                    "anyOf": [
                      {
                        "type": "null"
                      },
                      {
                        "type": "string",
                        "maxLength": 4000
                      }
                    ]
                  },
                  "district": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "city": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "state": {
                    "type": "string",
                    "maxLength": 4000
                  },
                  "postalCode": {
                    "type": "string",
                    "maxLength": 4000
                  }
                },
                "required": [
                  "label",
                  "addressLine",
                  "addressNumber",
                  "district",
                  "city",
                  "state",
                  "postalCode"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "companyId",
              "name",
              "address"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminCategories": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string",
                "const": "ACTIVE"
              },
              {
                "type": "string",
                "const": "INACTIVE"
              }
            ]
          }
        ],
        "minItems": 0,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.createAdminCategory": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "sortOrder": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 9007199254740991
                  }
                ]
              }
            },
            "required": [
              "name"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.updateAdminCategory": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "sortOrder": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              },
              "status": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              },
              "confirmReassign": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "boolean",
                    "const": false
                  },
                  {
                    "type": "boolean",
                    "const": true
                  }
                ]
              }
            },
            "required": [
              "id",
              "name",
              "sortOrder",
              "status"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.deleteAdminCategory": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "anyOf": [
              {
                "type": "boolean",
                "const": false
              },
              {
                "type": "boolean",
                "const": true
              }
            ]
          }
        ],
        "minItems": 1,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminProducts": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string",
                "const": "ACTIVE"
              },
              {
                "type": "string",
                "const": "INACTIVE"
              }
            ]
          }
        ],
        "minItems": 0,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.createAdminProduct": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "categoryId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "brand": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "description": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "status": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "categoryId",
              "name"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.updateAdminProduct": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "categoryId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "brand": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "description": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              },
              "status": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "id",
              "categoryId",
              "name",
              "status"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminVariants": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.createAdminVariant": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "productId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "skuCode": {
                "type": "string",
                "maxLength": 4000
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "saleUnit": {
                "type": "string",
                "maxLength": 4000
              },
              "minimumQuantity": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              },
              "status": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "productId",
              "skuCode",
              "name",
              "saleUnit",
              "minimumQuantity"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.updateAdminVariant": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "skuCode": {
                "type": "string",
                "maxLength": 4000
              },
              "name": {
                "type": "string",
                "maxLength": 4000
              },
              "saleUnit": {
                "type": "string",
                "maxLength": 4000
              },
              "minimumQuantity": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              },
              "status": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "id",
              "skuCode",
              "name",
              "saleUnit",
              "minimumQuantity",
              "status"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.listAdminProductImages": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "productId": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000,
                    "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                  }
                ]
              },
              "variantId": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000,
                    "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                  }
                ]
              }
            },
            "required": [],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.uploadAdminProductImage": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "productId": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000,
                    "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                  }
                ]
              },
              "variantId": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000,
                    "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                  }
                ]
              },
              "altText": {
                "type": "string",
                "maxLength": 4000
              },
              "isPrimary": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "boolean",
                    "const": false
                  },
                  {
                    "type": "boolean",
                    "const": true
                  }
                ]
              }
            },
            "required": [
              "altText"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin.getAdminImageUrl": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "admin.admin-status.changeEstablishmentStatus": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "anyOf": [
              {
                "type": "string",
                "const": "ACTIVE"
              },
              {
                "type": "string",
                "const": "INACTIVE"
              }
            ]
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.listOrders": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.listOrderNotifications": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.getOrderDetails": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.confirmOrderReceipt": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.cancelOrder": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "string",
            "maxLength": 4000
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.setCartItemQuantity": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "cartId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "skuId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "quantity": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              }
            },
            "required": [
              "cartId",
              "skuId",
              "quantity"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.getActiveCart": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.listCatalog": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.addCatalogItem": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "integer",
            "minimum": 0,
            "maximum": 9007199254740991
          }
        ],
        "minItems": 1,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.confirmActiveCart": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "cartId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "addressId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "deliveryWindow": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "Hoje"
                  },
                  {
                    "type": "string",
                    "const": "Amanhã"
                  }
                ]
              },
              "customerNote": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              }
            },
            "required": [
              "cartId",
              "addressId",
              "deliveryWindow"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "orders.order.confirmFinalOrderPrice": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "customer.customer.getCustomerContext": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "customer.customer.selectCustomerEstablishment": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "customer.customer.listActiveAddresses": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "customer.customer.createAddress": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "label": {
                "type": "string",
                "maxLength": 4000
              },
              "addressLine": {
                "type": "string",
                "maxLength": 4000
              },
              "addressNumber": {
                "type": "string",
                "maxLength": 4000
              },
              "addressComplement": {
                "type": "string",
                "maxLength": 4000
              },
              "district": {
                "type": "string",
                "maxLength": 4000
              },
              "city": {
                "type": "string",
                "maxLength": 4000
              },
              "state": {
                "type": "string",
                "maxLength": 4000
              },
              "postalCode": {
                "type": "string",
                "maxLength": 4000
              }
            },
            "required": [
              "label",
              "addressLine",
              "addressNumber",
              "addressComplement",
              "district",
              "city",
              "state",
              "postalCode"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "invitations.invitation.acceptCompanyInvitation": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "token": {
                "type": "string",
                "maxLength": 64,
                "pattern": "^[0-9a-fA-F]{64}$"
              },
              "fullName": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "maxLength": 4000
                  }
                ]
              }
            },
            "required": [
              "token"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "invitations.invitation.createCompanyInvitation": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "companyId": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "email": {
                "type": "string",
                "maxLength": 4000
              },
              "role": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "string",
                    "const": "CUSTOMER"
                  },
                  {
                    "type": "string",
                    "const": "INTERNAL_OPERATOR"
                  },
                  {
                    "type": "string",
                    "const": "DRIVER"
                  }
                ]
              },
              "expiresInDays": {
                "anyOf": [
                  {
                    "type": "null"
                  },
                  {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 9007199254740991
                  }
                ]
              }
            },
            "required": [
              "companyId",
              "email"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "chat.chat.listDirectConversations": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "chat.chat.listDirectMessages": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "chat.chat.sendDirectMessage": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          },
          {
            "type": "string",
            "maxLength": 4000
          }
        ],
        "minItems": 2,
        "maxItems": 2,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "chat.chat.createDirectConversation": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 4000,
            "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "banners.banner.listActiveBanners": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "banners.banner.listAdminBanners": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "maxItems": 0
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "banners.banner.createAdminBanner": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "altText": {
                "type": "string",
                "maxLength": 4000
              },
              "title": {
                "type": "string",
                "maxLength": 4000
              },
              "sortOrder": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              },
              "status": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "altText",
              "title",
              "sortOrder",
              "status"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "banners.banner.updateAdminBanner": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 4000,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              },
              "altText": {
                "type": "string",
                "maxLength": 4000
              },
              "title": {
                "type": "string",
                "maxLength": 4000
              },
              "sortOrder": {
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991
              },
              "status": {
                "anyOf": [
                  {
                    "type": "string",
                    "const": "ACTIVE"
                  },
                  {
                    "type": "string",
                    "const": "INACTIVE"
                  }
                ]
              }
            },
            "required": [
              "id",
              "altText",
              "title",
              "sortOrder",
              "status"
            ],
            "additionalProperties": false
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  },
  "profile.updateMyPhone": {
    "type": "object",
    "properties": {
      "args": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "maxLength": 40
          }
        ],
        "minItems": 1,
        "maxItems": 1,
        "additionalItems": false
      }
    },
    "required": [
      "args"
    ],
    "additionalProperties": false
  }
};
