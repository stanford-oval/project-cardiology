# Cardiology Project
A virtual assistant, based on Almond, that helps doctors remind patients to track their blood pressure regularly.

# Build

To zip the necessary files, simply run "npm run build". This will auto-generate doctor.zip and patient.zip files in the root directory of the project. You can then upload these zip files to Thingpedia.

## Problem

Although blood pressure is a key measure that cardiologists use when diagnosing patients, deciding on courses of treatments, and measuring the effectiveness of drugs, cardiologists lack an easy means of reminding their patents to take blood pressure measurements and of tracking those measurements so that they are quickly aware if a patient’s blood pressure is at a concerning level.   

## Solution

1.	The instructions that a doctor provides to a patient are recorded and interpreted as a set of rules governing the times at which the patient should record their blood pressure (e.g., measure blood pressure every day at 9:00 AM and 9:00 PM) and the conditions under which the doctor should be notified about a potentially dangerous blood pressure level (e.g., if systolic blood pressure is above 140);
2.	The doctor can view the interpreted ruleset and correct any misinterpretations;
3.	At the times specified by these rules, the patient is notified (e.g., by a text) to record their blood pressure in the virtual assistant;
4.	If the patient does not record their pressure within some timeframe, a reminder text is sent; and
5.	If the patient does record their blood pressure, the virtual assistant checks whether the doctor (or, in practice, a nurse) should be notified, and if so sends an alert.

## Benefits

1.	For patients: The reminders will help patients follow their doctor’s instructions and keep track of their blood pressure, and logging the measurements in a virtual assistant will ensure that they are not lost, damaged, or illegible.
2.	For doctors: The alerting system will help ensure that doctors are aware of concerning trends in patients’ health and can adjust treatment regimens accordingly. Likewise, the availably of quantitative data regarding the day-to-day health of patients will assist doctors in making informed decisions regarding the courses of treatment they prescribe to new patients.
3.	For science: The assistant provides a platform for big data collection and analysis and would be applicable to the collection of any patient-monitored health measure, not just blood pressure. Accordingly, researchers might be able to use the platform to collect patient data; perhaps, because the system encourages patients to take health measurement and to record those measurements in real time, it will increase the reliability of this data.

## Features

1.	System for interpreting instructions to patients as set of rules;
2.	UI for doctors to review ruleset;
3.	System for sending notifications to patients and for patients to record their blood pressure; and
4.	System for doctors/nurses to view and manage alerts

## Tasks

Preliminarily, I think that we should focus on developing a simple version of the assistant dealing only with reminders and get it into doctors’ hands for feedback. Accordingly, we need to implement the following systems:

1.	System for sending notifications to patients based on ruleset;
2.	System for patients to enter blood pressure measurements into their virtual assistant;
3.	System for sending reminder notifications to patients based on whether they enter their measurements; and
4.	System for developing rulesets. In the long-term, this will involve NLP that will interpret doctors’ instructions, but for the initial version of the assistant, we might be able to make do with a simple UI in which doctors can specify the rules for their patients (e.g., enter the phone number of a patient and notification time(s)).

## Development Steps
1.	Basic reminder system (Remind me “buy groceries” at 8:00)
2.	Add support for creating reminder on other persons VA
3.	Add support for responding to reminder with text
4.	Add support for storing responses in DB
