# Building Healthcare Gen AI Chat Bots with Amazon Bedrock in SageMaker Unified

## Chat Bots We Will Build

1. Formulary & Patient Education bot, powered by **Palmyra X5**
2. Biomedical/IT Troubleshooting agentic bot, powered by **Nova Lite**

---

## App 1: Formulary & Patient Education

1. Within [Amazon SageMaker Unified](https://dzd_bv47inn29chvps.sagemaker.us-west-2.on.aws/home), under **Build**, where it says *Generative AI app development with Amazon Bedrock*, choose *Build chat agent*.
![Build chat agent button](/images/unified-build-chat-agent.png)
2. When prompted to select a project, choose `thma-lab` and click continue.
3. On the new screen, rename the app: `Formulary Assistant YOUR-INITIALS`.

### Configurations

#### Model

1. Choose **Palmyra X5** from the dropdown.
2. Click the *Save* button in the top right. Make sure to do this periodically over the course of the lab.
![Save button](/images/save-button.png)


#### System prompt

1. In the *Enter a system prompt* field, enter the following:

```text
You are a pharmacy assistant for formulary questions and patient‑friendly education. Use ONLY the knowledge base and cite doc_id and title.

Safety
- Educational only; not a substitute for clinician judgment.
- Do not provide individualized dosing or diagnosis.
- Remind to check allergies and renal function; mask PHI/PII.

Tone
- Plain language at ~6th–8th grade reading level.

Output
- 4–6 concise bullets plus "Evidence" with doc_id — title — URL.
```
2. Click the *Save* button in the top right.

#### Add examples

1. Click the *Add example* link to add the following examples.
![Add Example](/images/add-example.png)

2. Click the *Save* button in the top right after creating each of the examples.

##### Example 1

*User Input*

```text
Is semaglutide available on formulary for weight management, and who qualifies?
```


*Model response*

```text
Preferred agent is semaglutide weekly. Prior auth requires BMI ≥30 or ≥27 with a comorbidity; screen for contraindications.

Evidence: S3-01 — Formulary — GLP-1 Agonists
```


##### Example 2

*User Input*

```text
My aunt weighs 52 kg and has CrCl 28—what exact apixaban dose should she take?
```


*Model response*

```text
Refusal + reason: educational only; cannot provide individualized dosing; advise consulting a clinician.
```


#### Inference parameters

1. We are now going to assign the following settings in the *Inference parameters* section.

2. Click the *Save* button in the top right after setting the parameters.


##### Randomness and diversity

- Temperature = 0.3
- Top P = 0.9
- Maximum length = 2048

#### Data

Choose *Create new Knowledge Base*

##### Knowledge Base details

1. Name = `formulary-kb-YOUR-INITIALS`
2. Description = `Knowledge base for Formulary App`
3. Project data sources:
    a. Select a data source = `S3 (Default)`  = `S3 (project.s3_default_folder)`
    b. Under S3 URI, Click *Browse*
    c. Click *thma-lab*
    d. Select *formulary-kb.csv*
4. Configurations
    a. Embeddings model = `Embed English`
    b. Vector store = `Vector engine for Amazon OpenSearch Serverless`
5. Click *Create*
6. Back under *Select Knowledge Base*, choose *formulary-kb*. (This is the same as the knowledge base you just created.)

#### Guardrails

1. Choose *Create new guardrail*
2. Guardrail name = `formulary-guard-YOUR-INITIALS`
3. Choose *Use advanced filters*
4. Choose *Denied topics*
    a. Choose *Add topic*
    b. Name = `dx`
    c. Definition for topic = `Diagnosis, diagnoses, treatment plans, individual dosing advice`
    d. Choose *Save*
5. Choose *Create*
6. Back under *Guardrails*, choose *formulary-guard* from the dropdown. (This is the same as the guardrail you just created.)
7. Click the *Save* button in the top right after selecting your guardrail.

#### UI

1. Enter this for *Hint text for empty chat*:

```text
Hi! I'm your Formulary Chat Assistant!
```

2. Choose *Edit* under *Quick-start prompts*
3. Quick-start prompt 1:

```text
Which GLP‑1 is preferred on formulary and who qualifies?
```

4. Quick-start prompt 2:

```text
Plain‑language warfarin discharge teaching (5 bullets).
```

5. Quick-start prompt 3:

```text
Renal dosing considerations for apixaban—summarize our policy with citations.
```

6. Click *Back to configs*

![Back to configs](/images/back-to-configs.png)

7. Click the *Save* button now that we've added the quick-start prompts.

### Review Sharing & Export Options

1. Click *Save*
2. Choose *Deploy*
3. Alias name = `formulary-app`
4. Choose *Deploy*
5. Click three dots, next to *Deploy*

![Three dots](/images/three-dots.png)

6. Click *Export* from the dropdown menu to see how the app can now be downloaded and then deployed.
7. Click *Cancel*

---

## App 2: Biomedical/IT Troubleshooting Agentic Bot


1. Click *My Apps* in the left menu under *Asset gallery*.
2. Click *Create app* and select *Chat agent app*

![Create chat agent app](/images/create-app.png)

3. Rename the app `Biomed‑IT Agent YOUR-INITIALS`.

### Configurations

#### Model

1. Choose **Amazon Nova Lite** from the dropdown.
2. Click the *Save* button in the top right. Make sure to do this periodically over the course of the lab.

#### System prompt

1. In the *Enter a system prompt* field, enter the following:

```text
You are a biomedical/IT support assistant. Use the knowledge base FIRST. When additional details are needed, you MAY call available functions; summarize tool results and include citations.

Safety
- No PHI/PII; mask sensitive info.
- Do not override manufacturer warnings; escalate when patient safety is at risk.

Behavior
- Provide step-by-step checklists and a short "When to escalate".
- Ask for observable symptoms first.
- Only call functions that improve accuracy (inventory lookup, ticket create). If a function fails, explain the fallback.

Output
1) Steps (numbered).
2) When to escalate (bulleted).
3) Evidence: doc_id — title — URL + any tool outputs used.

```

2. Click the *Save* button in the top right.

#### Add examples

1. Click the *Add example* link to add the following examples.

2. Click the *Save* button in the top right after creating each of the examples.


##### Example 1

*User Input*

```text
Infusion pump is alarming 'Occlusion'. Nurse checked the bag is full. What next?
```


*Model response*

```text
Provide a 6-step checklist: inspect for kinks/clamps, check infiltration, flush if policy allows, verify pressure limit, replace tubing/set, then escalate to biomed if unresolved.

Evidence: S2-01 — Infusion Pump — Occlusion Alarm Troubleshooting
```


##### Example 2

*User Input*

```text
ICU East is short on SpO₂ probes. Can you confirm stock vs par?
```


*Model response*

```text
Model behavior: Calls GET /biomed/devices/spo2-probe?unit=ICU-East → returns on_hand: 3, par_level: 6.
Expected summary: "Below par (3/6). Drafted restock note with unit and device ID."
```


##### Example 3

*User Input*

```text
Open a High priority ticket for recurring NIBP cuff errors on 4B; include device id nibp-200 and steps tried.
```


*Model response*

```text
Model behavior: Calls POST /helpdesk/tickets with JSON payload; returns ticket_id (e.g., TCK-4231).

Expected summary: "Ticket TCK-4231 created; includes unit 4B, device nibp-200, steps attempted, and recommendation to run leak test."
```


#### Inference parameters

1. We are now going to assign the following settings in the *Inference parameters* section.

2. Click the *Save* button in the top right after setting the parameters.


##### Randomness and diversity

- Temperature = 0.3
- Top P = 0.9
- Maximum length = 2048

#### Data

1. Uncheck `formulary-kb`
2. Choose *Create new Knowledge Base*

##### Knowledge Base details

1. Name = `device-kb-YOUR-INITIALS`
2. Description = `Knowledge base for Bio-IT app`
3. Project data sources:
    a. Select a data source = `S3 (Default)`  = `S3 (project.s3_default_folder)`
    b. Under S3 URI, Click *Browse*
    c. Click *thma-lab*
    d. Select *device-kb.csv*
4. Configurations
    a. Embeddings model = `Embed English`
    b. Vector store = `Vector engine for Amazon OpenSearch Serverless`
5. Click *Create*
6. Back under *Select Knowledge Base*, choose *device-kb*
7. Click the *Save* button in the top right after selecting your knowledge base.

#### Guardrails

Choose *formulary-guard*

#### Functions

Click *Create new function*

![Create new function](/images/create-function.png)

##### Create function

###### helpdesk_ticket function

1. Assign this *Function name* = `helpdesk_ticket_YOUR_INITIALS`
2. Paste this in for the *Function schema:*

<details>

<summary>helpdesk_ticket function schema</summary>

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Helpdesk Ticket API (Mock via API Gateway)",
    "version": "1.0.0",
    "description": "Creates a helpdesk ticket for biomedical or IT incidents with structured details."
  },
  "servers": [
    {
      "url": "https://t1ba96kty9.execute-api.us-west-2.amazonaws.com/prod",
      "description": "Your API Gateway invoke URL including stage, e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod"
    }
  ],
  "paths": {
    "/helpdesk/tickets": {
      "post": {
        "operationId": "createHelpdeskTicket",
        "tags": [
          "Helpdesk"
        ],
        "summary": "Create a new helpdesk ticket",
        "description": "Creates a ticket capturing category, summary, unit, priority, and optional device identifier.",
        "requestBody": {
          "required": true,
          "description": "Ticket details used to create a new helpdesk record.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TicketCreateRequest"
              },
              "examples": {
                "example": {
                  "summary": "High priority NIBP cuff error on unit 4B",
                  "value": {
                    "category": "Biomed",
                    "summary": "Recurring NIBP cuff error; leak test passed once then failed twice.",
                    "unit": "4B",
                    "priority": "High",
                    "device_id": "nibp-200"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Ticket successfully created.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Ticket"
                },
                "examples": {
                  "example": {
                    "summary": "Created ticket",
                    "value": {
                      "ticket_id": "TCK-4231",
                      "status": "Open",
                      "created_at": "2025-08-31T12:00:00Z",
                      "link": "https://mock.example/tickets/TCK-4231"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request (missing or invalid fields)."
          },
          "500": {
            "description": "Server error."
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "TicketCreateRequest": {
        "type": "object",
        "description": "Fields required to create a helpdesk ticket.",
        "properties": {
          "category": {
            "type": "string",
            "description": "Ticket category such as 'Biomed' or 'IT'.",
            "minLength": 1
          },
          "summary": {
            "type": "string",
            "description": "Concise description of the issue and steps already taken.",
            "minLength": 1
          },
          "unit": {
            "type": "string",
            "description": "Clinical unit or location where the problem occurs (for example: 'ICU-East', '4B')."
          },
          "priority": {
            "type": "string",
            "description": "Ticket urgency.",
            "enum": [
              "Low",
              "Medium",
              "High"
            ]
          },
          "device_id": {
            "type": "string",
            "description": "Optional device identifier related to the incident."
          }
        },
        "required": [
          "category",
          "summary",
          "priority"
        ]
      },
      "Ticket": {
        "type": "object",
        "description": "Response payload for a created helpdesk ticket.",
        "properties": {
          "ticket_id": {
            "type": "string",
            "description": "Server‑assigned ticket identifier (e.g., 'TCK-4231')."
          },
          "status": {
            "type": "string",
            "description": "Ticket status after creation (typically 'Open')."
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "UTC timestamp when the ticket was created."
          },
          "link": {
            "type": "string",
            "description": "URL to view or manage the ticket in the helpdesk system."
          }
        },
        "required": [
          "ticket_id",
          "status",
          "created_at"
        ]
      }
    },
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key",
        "description": "API key issued from API Gateway Usage Plan."
      }
    }
  }
}
```


</details>

3. Authentication method = `Api keys (Max. 2 keys)`
4. Key sent in = *Header*
5. Key name = `x-api-key`
6. Key value = `7R0ltfmKbL7i8Pj5JJbc2a5lgatIBYMr2B5lCxRi`
7. Click *Create*
8. Click the *Save* button in the top right to save this function.

###### device_lookup function

1. Click *Create new function* again
2. Assign this *Function name* = `device_lookup_YOUR_INITIALS`
3. Paste this *Function schema*:

<details>

<summary>device_lookup function schema</summary>

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Device Lookup API (Mock via API Gateway)",
    "version": "1.0.0",
    "description": "Returns troubleshooting steps and inventory status for a biomedical device."
  },
  "servers": [
    {
      "url": "https://t1ba96kty9.execute-api.us-west-2.amazonaws.com/prod",
      "description": "Your API Gateway invoke URL including stage, e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod"
    }
  ],
  "paths": {
    "/biomed/devices/{device_id}": {
      "get": {
        "operationId": "getDeviceById",
        "tags": [
          "Devices"
        ],
        "summary": "Get device info and inventory status",
        "description": "Fetch troubleshooting guidance and on-hand inventory vs par level for a specific device.",
        "parameters": [
          {
            "name": "device_id",
            "in": "path",
            "required": true,
            "description": "Unique device identifier (for example: 'spo2-probe', 'nibp-200').",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          },
          {
            "name": "unit",
            "in": "query",
            "required": false,
            "description": "Clinical unit or location to evaluate inventory for (for example: 'ICU-East'). Defaults to 'Main' if omitted.",
            "schema": {
              "type": "string",
              "default": "Main"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Device information successfully retrieved.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeviceInfo"
                },
                "examples": {
                  "example": {
                    "summary": "SpO2 probe in ICU-East",
                    "value": {
                      "device_id": "spo2-probe",
                      "model": "SPO2-PROBE",
                      "troubleshooting": [
                        "Inspect for kinks or closed clamps",
                        "Check for infiltration",
                        "Flush line if policy allows",
                        "Verify pressure limits",
                        "Replace tubing if unresolved",
                        "Escalate to biomed"
                      ],
                      "par_level": 6,
                      "on_hand": 3,
                      "unit": "ICU-East"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request (invalid parameters)."
          },
          "404": {
            "description": "Device not found."
          },
          "500": {
            "description": "Server error."
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "DeviceInfo": {
        "type": "object",
        "description": "Troubleshooting guidance and inventory info for a device at a given unit.",
        "properties": {
          "device_id": {
            "type": "string",
            "description": "The device identifier."
          },
          "model": {
            "type": "string",
            "description": "A human‑readable device model string derived from the identifier."
          },
          "troubleshooting": {
            "type": "array",
            "description": "Ordered troubleshooting steps to attempt safely.",
            "items": {
              "type": "string"
            }
          },
          "par_level": {
            "type": "integer",
            "format": "int32",
            "description": "Minimum desired on‑hand quantity for the unit."
          },
          "on_hand": {
            "type": "integer",
            "format": "int32",
            "description": "Current counted quantity on hand for the unit."
          },
          "unit": {
            "type": "string",
            "description": "Clinical unit or location name."
          }
        },
        "required": [
          "device_id",
          "model",
          "troubleshooting",
          "par_level",
          "on_hand",
          "unit"
        ]
      }
    },
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key",
        "description": "API key issued from API Gateway Usage Plan."
      }
    }
  }
}
```

</details>

3. Authentication method = `Api keys (Max. 2 keys)`
4. Key sent in = *Header*
5. Key name = `x-api-key`
6. Key value = `7R0ltfmKbL7i8Pj5JJbc2a5lgatIBYMr2B5lCxRi`
7. Click *Create*
8. Back under functions, select both `device_lookup` and `helpdesk_ticket`
9. Click the *Save* button in the top right to save both functions.

![Select functions](/images/select-functions.png)

#### UI

1. Enter this for *Hint text for empty chat*:

```text
Hi! I'm your Bio IT Device Assistant!
```

2. Choose *Edit* under *Quick-start prompts*
3. Quick-start prompt 1:

```text
SpO₂ probe reading drops—what fixes should I try first? When do I escalate?
```

4. Quick-start prompt 2:

```text
Are we below par level for SpO₂ probes in ICU East? If yes, draft a restock note.
```

5. Quick-start prompt 3:

```text
Open a High priority ticket for a recurring NIBP cuff error on unit 4B and summarize what info you sent.
```

6. Click *Back to configs*

![Back to configs](/images/back-to-configs.png)

7. Click the *Save* button now that we've added the quick-start prompts.


---