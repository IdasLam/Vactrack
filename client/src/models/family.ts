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
    vaccines: Vaccinations
}
