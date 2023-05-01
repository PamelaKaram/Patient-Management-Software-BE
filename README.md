# Patient-Management-Software-BE

This is a patient management software that enables doctors, patients, and pharmacies to manage their healthcare services efficiently.

## Features
### This software has the following features:

- Doctor view: Allows doctors to view their patients, their medical history, medical tests, medical condition, book them an appointment, view their upcoming appointments, and get reminders by email.

- Patient view: Allows patients to view their profile and their appointments.

- Pharmacy view: Allows pharmacies to view patient's prescription and print it.

- General view: Allows authorized personnel to view patient records and manage the system's settings.

## Installation
### To install the patient management software, follow the steps below:

1. Run docker
`docker compose up`

2. Open another terminal, and migrate schema
`npx sequelize-cli db:migrate`

3. Seed database
`npx sequelize-cli db:seed:all`

4. Rerun docker compose up to update typesense search engine

