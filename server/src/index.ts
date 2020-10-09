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

/**
 * Goes through every family and get the reminders that are supposed to get an email notification.
 * Reminders will be sent out a week before the revaccination is due.
 *
 * Return ReminderVaccination[]
 */
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

// User node-mailer, creating a transporter through email and password in .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
})

/**
 * Class reminder that have methods to abel to send an email
 */
class reminder {
    vaccinationReminderData: ReminderVaccination[]

    constructor() {
        this.vaccinationReminderData = []
    }

    /**
     * Init the class with vaccinations that will be sent out
     * @param vaccinationReminderData
     * @returns void
     */
    addReminderData(vaccinationReminderData: ReminderVaccination[]) {
        this.vaccinationReminderData = vaccinationReminderData
        this.createMail()
    }

    /**
     * Create an email, get temlpate with vaccine and person data. Procceeds to call sendMail method.
     */
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

    /**
     * Set the status of the vaccine to reminded in database.
     *
     * @param id
     * @param familyId
     * @param name
     * @returns void
     */
    async setReminded(id: string, familyId: string, name: string) {
        const data = await db.collection('family').doc(familyId).get()
        const familyDoc = db.collection('family').doc(familyId)
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

    /**
     * Send email to user.
     * @param mailOptions
     * @param id
     * @param familyId
     * @param name
     * @returns void
     */
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

// Init the class
const remind = new reminder()

/**
 * Fetches data from database.
 */
const setReminder = async () => {
    const remminderData = await getVaccinationReminderData()

    remind.addReminderData(remminderData)
}

/**
 * Will check the database every hour if any new reminders should be sent out.
 */
new CronJob('0 * * * *', () => {
    console.log('Checking...')
    setReminder()
}).start()
