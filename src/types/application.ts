export type ApplicationPayload = {
    email: string;
    phoneNumber: string;
    companyName: string;
    firstName: string;
    lastName: string;
    averageVolume: string;
};

export type ApplicationFormInputs = {
    email: string;
    phone: string;
    phoneCountryCode?: string;
    companyName: string;
    firstName: string;
    lastName: string;
    estimatedVolume?: string;
};

export type ShareHolder = {
    shareHolderId: number;
    shareHolderName: string;
    shareHolderSurname: string;
    shareHolderIdentityNumber: string;
    shareHolderBirthDate: string;
    shareHolderCreatedDate: string;
};

export type ApplicationDetail = {
    applicationId: number;
    userId: number;
    userName?: string;
    userSurname?: string;
    phone?: string;
    applicationNumber: string;
    applicationStatus: number;
    applicationStep: number;
    avarageVolume: string;
    bankAccountName: string;
    taxNumber: string;
    iban: string;
    userIdentityNumber: string;
    userBirthDate: string;
    hasAnyShareHolder: boolean;
    applicationCreatedDate: string;
    applicationUpdatedDate: string;
    email?: string;
    shareHolders: ShareHolder[];
};

export type GetApplicationDetailResponse = {
    applications: ApplicationDetail[];
};

export type UpsertShareHoldersPayload = {
    applicationId: number;
    hasAnyShareholder: boolean;
    shareHolders: {
        name: string;
        surname: string;
        identityNumber: string;
        birthDate: string;
    }[];
};

export type UpdateAuthorizedUserInfoPayload = {
    applicationId: number;
    userIdentityNumber: string;
    userBirthDate: string;
    userIdentitySerialNumber: string;
};

export type ApplicationDetailResponse = GetApplicationDetailResponse;
export type ShareholdersRequest = UpsertShareHoldersPayload;
export type OfficerInfoRequest = UpdateAuthorizedUserInfoPayload;

export type BankInfoRequest = {
    applicationId: number;
    bankAccountName: string;
    taxNumber: string;
    iban: string;
};
