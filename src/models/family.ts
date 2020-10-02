type Vaccine = {
    name: string
    date: firebase.firestore.Timestamp
    notes?: string
}

export type ActiveVaccine = Vaccine & {
    revaccination: firebase.firestore.Timestamp
}

export type Person = {
    activeVaccines: ActiveVaccine[]
    status: string
    email: string
    birthday?: firebase.firestore.Timestamp
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
    revaccination?: firebase.firestore.Timestamp
}

export type PastVaccinations = (family: Family, name: string) => AllTypesOfVaccines[]

export type Name = string

export type InputVaccineData = {
    name: string
    vaccineName: string
    date: firebase.firestore.Timestamp
    revaccination?: firebase.firestore.Timestamp
}

export type VaccineData = {
    name: string
    date: firebase.firestore.Timestamp
    revaccination?: firebase.firestore.Timestamp
}
