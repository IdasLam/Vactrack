import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'
import { ReminderVaccination } from '../models/family'
import dayjs from 'dayjs'

/**
 * Takes the data and adds it to the mail template, returns the mail template filled with data.
 * @param data
 * @returns string
 */
const fillMail = async (data: ReminderVaccination) => {
    const { contactName, personName, revaccination, name } = data
    const file = await fs.readFile(path.join(__dirname, 'templates/mail.hbs'), 'utf-8')

    const template = Handlebars.compile(file)

    return template({
        name: contactName,
        person: personName,
        vaccine: name,
        date: dayjs(revaccination).format('YYYY-MM-DD'),
    })
}

export default fillMail
