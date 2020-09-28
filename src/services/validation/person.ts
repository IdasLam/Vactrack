import { Family, Name } from '../../models/family'

export const nameValidation = (name: string, names: Name[]) => {
    return names.includes(name)
}
