import { firestore } from 'firebase-admin'

/**
 * If the databases needed does not exsist create them with dummy data
 * @param db
 */
export const initFirestore = async (db: firestore.Firestore) => {
    const family = await db.collection('family').get()
    const article = await db.collection('family').get()

    if (family.empty) {
        console.log('Creating family collection...')

        db.collection('family')
            .doc('init')
            .set({
                init: {
                    activeVaccines: [],
                    email: 'vacktrack@gmail.com',
                    status: 'user',
                    vaccines: [],
                },
            })
    } else if (article.empty) {
        console.log('Creating articles collection...')

        db.collection('articles')
            .doc('travelJapan')
            .set({
                init: {
                    link:
                        'https://wwwnc.cdc.gov/travel/destinations/traveler/none/japan?s_cid=ncezid-dgmq-travel-single-001',
                    text: 'Guidelines provided by CDC',
                    title: 'Planning on traveling to Japan?',
                },
            })

        db.collection('article')
            .doc('travelSweden')
            .set({
                init: {
                    link:
                        'https://www.folkhalsomyndigheten.se/the-public-health-agency-of-sweden/communicable-disease-control/vaccinations/travel-vaccinations/',
                    text: 'Guidelines provided by Folkhälsomyndigheten.',
                    title: 'Planning on traveling to Sweden?',
                },
            })
    }
}
