type Vaccine = {
    name: string
    date: FirebaseFirestore.Timestamp
    notes?: string
}

export type ReminderVaccination = {
    reminded: boolean
    date: Date
    id: string
    name: string
    revaccination: Date
    email: string
    contactName: string
    personName: string
    familyId: string
}

export type MailData = {
    from: string
    to: string
    subject: string
    text: string
}

export type ActiveVaccine = Vaccine & {
    revaccination: FirebaseFirestore.Timestamp
    reminded: boolean
    id: string
}

export type Person = {
    activeVaccines: ActiveVaccine[]
    status: string
    email: string
    birthday?: FirebaseFirestore.Timestamp
    vaccines: Vaccine[]
}

export type Family = {
    [key: string]: Person
}

export type FamilyProps = {
    family?: Family
}

export type Vaccinations = {
    [key: string]: ActiveVaccine[]
}

export type ActiveVaccinations = {
    vaccines: Vaccinations | undefined
}

export type AllTypesOfVaccines = Vaccine & {
    revaccination?: FirebaseFirestore.Timestamp
}

export type PastVaccinations = (family: Family, name: string) => AllTypesOfVaccines[]

export type Name = string

export type InputVaccineData = {
    name: string
    vaccineName: string
    date: FirebaseFirestore.Timestamp
    revaccination?: FirebaseFirestore.Timestamp
}

export type VaccineData = {
    name: string
    date: FirebaseFirestore.Timestamp
    reminded: boolean
    revaccination?: FirebaseFirestore.Timestamp
    id: string
}
