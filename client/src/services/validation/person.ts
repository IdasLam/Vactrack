import { Name } from '../../models/family'

/**
 * Checks if the name is in the name list
 * @param name
 * @param names
 * @returns boolean
 */
export const nameValidation = (name: string, names: Name[]) => {
    return names.includes(name)
}
