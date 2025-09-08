# Building Healthcare Gen AI Chat Bots<br>with Amazon Bedrock in SageMaker Unified

## Chat Bots We Will Build

1. Formulary & Patient Education bot, powered by **Writer Palmyra X5**
2. Biomedical/IT Troubleshooting agentic bot, powered by **Amazon Nova Lite**

---

## App 1: Formulary & Patient Education

1. Within <a href="https://dzd_bv47inn29chvps.sagemaker.us-west-2.on.aws/home" target="_blank" rel="noopener noreferrer">Amazon SageMaker Unified</a>, under **Build**, where it says *Generative AI app development with Amazon Bedrock*, choose *Build chat agent*.
![Build chat agent button](/images/unified-build-chat-agent.png)
2. When prompted to select a project, choose **thma-lab** and click continue.
3. On the new screen, rename the app: **Formulary Assistant YOUR INITIALS**. (You cannot copy and paste this; you will need to manually type the name of the app.)

### Configurations

#### Model

1. Choose **Palmyra X5** from the dropdown.

> Palmyra X5 (Writer) is an enterprise LLM designed for dependable, grounded outputs and controllable behavior in mission‑critical workflows. It excels at instruction following, summarization, and extraction with a focus on accuracy, safety, and compliance in regulated settings.

2. Click the *Save* button in the top right. Make sure to do this periodically over the course of the lab.
![Save button](/images/save-button.png)

#### System prompt

> **What is a System Prompt?**  
> A system prompt is the initial instruction set that defines how your AI assistant should behave, communicate, and respond to users. Think of it as giving your AI assistant a job description and personality guide. It sets boundaries for what the AI should and shouldn't do, establishes the tone of communication (like speaking at a 6th-8th grade reading level for patient education), and ensures consistent, safe responses aligned with your healthcare organization's policies.

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

> **Why Add User Input and Model Response Examples?**  
> Examples serve as training scenarios that teach your AI assistant how to handle specific situations correctly. By providing sample conversations (both appropriate responses and proper refusals), you're creating a reference library that helps the AI understand your expectations. This is especially critical in healthcare, where the AI must know when to provide educational information versus when to refuse requests for individualized medical advice that could be harmful.

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

> **Understanding Inference Parameters**  
> Inference parameters control how creative or conservative your AI assistant's responses will be. **Temperature** (0.3 in our case) controls randomness: lower values mean more predictable, consistent responses, which is crucial for healthcare information. **Top P** (0.9) limits the AI's word choices to the most probable options, preventing unusual or inappropriate language. **Maximum length** (2048) sets how long responses can be, ensuring the AI provides complete answers without being overly verbose.

1. We are now going to assign the following settings in the *Inference parameters* section.

2. Click the *Save* button in the top right after setting the parameters.


##### Randomness and diversity

- Temperature = **0.3**
- Top P = **0.9**
- Maximum length = **2048**

#### Data

> **What is a Bedrock Knowledge Base?**  
> A Knowledge Base is your AI's reference library. It is a collection of your organization's documents, policies, and information that the AI can search through to provide accurate, up-to-date answers. Instead of relying solely on the AI's general training, a Knowledge Base allows your assistant to access your specific formulary data, clinical guidelines, or device manuals. This ensures responses are grounded in your organization's actual policies and procedures, dramatically reducing errors and improving relevance for your healthcare teams.

Choose *Create new Knowledge Base*

##### Knowledge Base details

1. Name = `formulary-kb-INITIALS`
2. Description = `Knowledge base for Formulary App`
3. Under *Select data source type*, choose *Project data sources*, then proceed with the following:
   
    a. From the drop down for *Select a data source*, choose **S3 (Default)**
    
    b. Under S3 URI, Click *Browse*
    
    c. Click *thma-lab*
    
    d. Select *formulary-kb.csv*

<details>
<summary>📊 View formulary-kb.csv sample data</summary>

| doc_id | title | text (excerpt) |
|--------|-------|----------------|
| S3-01 | Formulary — GLP-1 Agonists | Preferred: semaglutide weekly. Prior authorization: BMI ≥30 or BMI ≥27 with comorbidity... |
| S3-02 | Patient Education — New Warfarin | Take at the same time daily; keep vitamin K intake steady; attend INR checks... |
| S3-03 | Renal Dosing — Anticoagulants | Apixaban: reduce dose when 2 of 3 present—age ≥80, weight ≤60 kg, or SCr ≥1.5 mg/dL... |
| S3-04 | Formulary — SGLT2 Inhibitors | Preferred: empagliflozin; avoid with eGFR <20 mL/min/1.73m²... |
| S3-05 | Patient Education — Inhaler Technique | Exhale fully; seal lips; inhale slowly while pressing canister... |

*Contains 20 total records with formulary guidelines and patient education content*
</details>

4. Configurations:
   
    a. Embeddings model = **Embed English**
    
    > Converts text into vectors for semantic retrieval from your knowledge base.
    > Use "Embed English" for English content; choose multilingual embeddings if documents span languages.
    
    b. Vector store = **Vector engine for Amazon OpenSearch Serverless**
    
5. Click *Create*
6. Back under *Select Knowledge Base*, choose *formulary-kb*. (This is the same as the knowledge base you just created.)

#### Guardrails

> **Why Are Bedrock Guardrails Important?**  
> Guardrails act as safety barriers that prevent your AI from providing inappropriate or harmful content. They filter out topics you've defined as off-limits and can detect attempts to manipulate the AI into unsafe behavior. 

1. Choose *Create new guardrail*
2. Guardrail name = `formulary-guard-INITIALS`
3. Choose *Use advanced filters*
4. Choose *Denied topics*:
   
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

> **What is CDK Export Capability?**  
> CDK (Cloud Development Kit) export allows you to package your entire AI application, including all its configurations, prompts, guardrails, and settings, into code that can be deployed across different environments. This means once you've built and tested your AI assistant, you can export it and deploy identical copies to other departments, hospitals, or regions without rebuilding from scratch. It ensures consistency, speeds up deployment, and maintains compliance standards across your entire organization.

1. Click *Save*
2. Choose *Deploy*
3. Alias name = `formulary-app-INITIALS`
4. Choose *Deploy*
5. Click three dots, next to *Deploy*
![Three dots](/images/three-dots.png)
6. Click *Export* from the dropdown menu to see how the app can now be downloaded and then deployed.
7. Click *Cancel*
8. Test out your bot!

---

## App 2: Biomedical/IT Troubleshooting Agentic Bot


1. Click *My Apps* in the left menu under *Asset gallery*.
2. Click *Create app* and select *Chat agent app*
![Create chat agent app](/images/create-app.png)
3. Name the app `BiomedIT Agent YOUR INITIALS`. Make sure you actually type this out and not try to paste into this field.

### Configurations

#### Model

1. Choose **Amazon Nova Lite** from the dropdown.
> Amazon Nova Lite is a cost‑efficient, low‑latency foundation model optimized for chat and tool‑use/agentic scenarios. It’s tuned for fast, general‑purpose reasoning and function calling, making it a strong fit for responsive operational assistants.

2. Click the *Save* button in the top right. Make sure to do this periodically over the course of the lab.

#### System prompt

1. In the *Enter a system prompt* field, enter the following:
```text
You are a biomedical IT support assistant. Use the knowledge base FIRST. When additional details are needed, you MAY call functions.

Safety
- No PHI/PII; mask sensitive info.
- Do not override manufacturer warnings.

Behavior
- Provide checklists and a short "When to escalate".
- Only call functions that improve accuracy. If a function fails, explain.

Output
1) Steps (numbered).
2) When to escalate (bulleted).
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
Provide a checklist: inspect for kinks/clamps, check infiltration, flush if policy allows, verify pressure limit, replace tubing/set, then escalate if unresolved.
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


#### Inference parameters

1. We are now going to assign the following settings in the *Inference parameters* section.
2. Click the *Save* button in the top right after setting the parameters.


##### Randomness and diversity

- Temperature = **0.3**
- Top P = **0.9**
- Maximum length = **2048**

#### Data

Choose *Create new Knowledge Base*

##### Knowledge Base details

1. Name = `device-kb-INITIALS`
2. Description = `Knowledge base for Bio-IT app`
3. Under *Select data source type*, choose *Project data sources*, then proceed with the following:
   
    a. From the drop down for *Select a data source*, choose **S3 (Default)**
    
    b. Under S3 URI, Click *Browse*
    
    c. Click *thma-lab*
    
    d. Select *device-kb.csv*

<details>
<summary>📊 View device-kb.csv sample data</summary>

| doc_id | title | text (excerpt) |
|--------|-------|----------------|
| S2-01 | Infusion Pump — Occlusion Alarm | Checklist: inspect for kinks or closed clamps; check for infiltration; flush line if policy allows... |
| S2-02 | Vital Signs Monitor — SpO₂ Signal Loss | Ensure correct probe size and placement; warm extremity; remove nail polish... |
| S2-03 | Syringe Pump Calibration | Verify syringe brand/size; run calibration routine per manual; document results... |
| S2-06 | NIBP Cuff Error | Check hose/cuff integrity and size; reposition; run leak test; replace cuff... |
| S2-18 | SpO₂ Probe Inventory | Maintain minimum par level of 6 per unit; trigger restock when on-hand < par... |

*Contains 20 total records with biomedical device troubleshooting and IT operations procedures*
</details>

4. Configurations:
   
    a. Embeddings model = **Embed English**
    
    > Converts text into vectors for semantic retrieval from your knowledge base.
    > Use "Embed English" for English content; choose multilingual embeddings if documents span languages.
    
    b. Vector store = **Vector engine for Amazon OpenSearch Serverless**
    
5. Click *Create*
6. Back under *Select Knowledge Base*, choose *device-kb*
7. Click the *Save* button in the top right after selecting your knowledge base.

#### Guardrails

Choose *formulary-guard*

#### Functions

> **What Are Functions?**  
> Functions enable your AI to take actions beyond just answering questions. In Bedrock, functions allow your AI app to interact with your hospital's systems, look up real-time information, and create tickets or orders. This is called "agentic" development because the AI becomes an active agent that can perform tasks on behalf of users. Functions connect your AI to APIs and databases, transforming it from a passive Q&A bot into an intelligent assistant that can accomplish real work within safety parameters you define.

We will now add agentic functions to the app. You have the option of using some pre-built functions, or building them on your own. 

##### Use Pre-built Functions

1. Under functions, select both **device_lookup** and **helpdesk_ticket**
![Select functions](/images/select-functions.png)
2. Click the *Save* button in the top right to save your progress.


##### Create Functions

Click *Create new function*

![Create new function](/images/create-function.png)


###### helpdesk_ticket function

1. Assign this *Function name* = `helpdesk_ticket_INITIALS`
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

3. Click the *Validate schema* button.
4. Authentication method = **Api keys (Max. 2 keys)**
5. Key sent in = *Header*
6. Key name = `x-api-key`
7. Key value = `7R0ltfmKbL7i8Pj5JJbc2a5lgatIBYMr2B5lCxRi`
8. Click *Create*.
9. Click the *Save* button in the top right to save this function.

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

3. Click the *Validate schema* button.
4. Authentication method = **Api keys (Max. 2 keys)**
5. Key sent in = *Header*
6. Key name = `x-api-key`
7. Key value = `7R0ltfmKbL7i8Pj5JJbc2a5lgatIBYMr2B5lCxRi`
8. Click *Create*
9. Back under functions, select both `device_lookup` and `helpdesk_ticket`
    ![Select functions](/images/select-functions.png)
10. Click the *Save* button in the top right to save both functions.


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


### Review Sharing & Export Options

1. Click *Save*
2. Choose *Deploy*
3. Alias name = `biomed-it-app-INITIALS`
4. Choose *Deploy*
5. Click three dots, next to *Deploy*
![Three dots](/images/three-dots.png)
6. Click *Export* from the dropdown menu to see how the app can now be downloaded and then deployed.
7. Click *Cancel*
8. Test out your bot!

---

## Biomed IT Device Monitor

> The Biomed IT Device Monitor shows near‑real‑time API activity initiated by your agent. As you chat, the agent can call device and helpdesk APIs (via functions) to look up inventory, draft tickets, or take actions on your behalf, with information about those calls appearing here.

- Understand agentic behavior: see when the assistant performs function calls (e.g., `GET /biomed/devices/...` or `POST /helpdesk/tickets`).
- Verify end‑to‑end flow: confirm calls succeed (2xx) and respond quickly; troubleshoot 4xx/5xx if they occur.
- Practice safe operations: use this view to validate that actions match the conversation and align with policy.
