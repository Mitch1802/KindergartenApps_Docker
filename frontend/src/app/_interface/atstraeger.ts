export interface IATSTraeger {
    id: number,
    mitglied_id: string,
    hausarzt: string,
    letzte_untersuchung: string,
    leistungstest: string,
    leistungstest_art: string,
    naechste_untersuchung?: string,
    tauglichkeit?: string,
    notizen: string,
    fdisk_aenderung: string,
    stbnr?: string,
    vorname?: string,
    nachname?: string,
    geburtsdatum?: string
    hauptberuflich?: boolean
}
