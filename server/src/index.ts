import path from 'path'
import dayjs from 'dayjs'
import { CronJob } from 'cron'
import './hadlebars/'
import nodemailer from 'nodemailer'
import admin from 'firebase-admin'
import { Family, ReminderVaccination, MailData, Person } from './models/family'
import dotenv from 'dotenv'
import fillMail from './hadlebars/index'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

admin.initializeApp({
    credential: admin.credential.cert(path.resolve(__dirname, '../serviceAccountKey.json')),
    databaseURL: 'https://vactrack-87132.firebaseio.com',
})

const db = admin.firestore()

const getVaccinationReminderData = async () => {
    const data = await db.collection('family').get()

    const vaccinationReminderData = data.docs.reduce((accReminders: any, family) => {
        const familyObject = Object.entries(family.data() as Family)

        const contactPerson = familyObject.find((person) => {
            const [, data] = person
            const { status, email } = data

            return status === 'user' && email
        })

        if (!contactPerson) {
            return
        }

        const [contactName, { email }] = contactPerson

        const reminders = familyObject.reduce((accumulator: any, currentValue) => {
            const [name, data] = currentValue
            const { activeVaccines } = data

            if (activeVaccines.length === 0) {
                return accumulator
            }

            const filteredVaccines = activeVaccines.filter((vaccine) => {
                const revaccinationDate = vaccine.revaccination.toDate()

                const dayDiff = dayjs(revaccinationDate).diff(dayjs(), 'day')

                return dayDiff <= 7 && dayDiff >= 0 && !vaccine.reminded
            })

            if (filteredVaccines.length === 0) {
                return accumulator
            }

            const reminderVaccines = filteredVaccines.map((vaccine) => {
                return {
                    ...vaccine,
                    date: vaccine.date.toDate(),
                    revaccination: vaccine.revaccination.toDate(),
                    personName: name,
                    email,
                    contactName,
                    familyId: family.id,
                }
            })

            return [...accumulator, ...reminderVaccines]
        }, [])

        return [...accReminders, ...reminders]
    }, [])

    return vaccinationReminderData as ReminderVaccination[]
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
})

class reminder {
    vaccinationReminderData: ReminderVaccination[]

    constructor() {
        this.vaccinationReminderData = []
    }

    addReminderData(vaccinationReminderData: ReminderVaccination[]) {
        this.vaccinationReminderData = vaccinationReminderData
        this.createMail()
    }

    createMail() {
        return this.vaccinationReminderData.map(async (vaccination) => {
            const { email, personName, id, familyId } = vaccination

            const mailOptions = {
                from: 'vacktrack@gmail.com',
                to: email,
                subject: `Vaccination for ${personName} is due soon.`,
                text: '',
                html: await fillMail(vaccination),
            }

            this.sendMail(mailOptions, id, familyId, personName)
        })
    }

    async setReminded(id: string, familyId: string, name: string) {
        const data = await db.collection('family').doc(familyId).get()
        const familyDoc = await db.collection('family').doc(familyId)
        const family = data.data()

        if (family) {
            const person: Person = family[name]
            let activeVaccines = person.activeVaccines

            const vaccination = activeVaccines.find((vaccine) => {
                return vaccine.id === id
            })

            if (vaccination) {
                vaccination.reminded = true
                activeVaccines = [...activeVaccines.filter((v) => v.id !== vaccination.id), vaccination]
                person.activeVaccines = activeVaccines

                await familyDoc.update({
                    [name]: person,
                })
            }
        }
    }

    sendMail(mailOptions: MailData, id: string, familyId: string, name: string) {
        this.setReminded(id, familyId, name)
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
                console.log(mailOptions)
                this.setReminded(id, familyId, name)
            }
        })
    }
}

const remind = new reminder()

const setReminder = async () => {
    const remminderData = await getVaccinationReminderData()

    remind.addReminderData(remminderData)
}

new CronJob('0 * * * *', () => {
    console.log('Checking...')
    setReminder()
}).start()
