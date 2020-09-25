import dayjs from 'dayjs'

export const convertDate = (date: firebase.firestore.Timestamp) => {
    return dayjs(date.toDate()).format('YYYY/MM/DD')
}
