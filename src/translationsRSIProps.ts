import type { DeepPartial } from "ts-essentials"

export const translations = {
  organizationSelect: {
    title: "Sélectionner une organisation",
  },
  selectImportType: {
    title: "Type d'importation",
  },
  selectEditorProfile: {
    title: "Profil d'importation",
  },
  uploadStep: {
    title: "Téléverser un fichier",
    manifestTitle: "Données attendues :",
    manifestDescription: "(Vous pourrez renommer ou supprimer des colonnes aux étapes suivantes)",
    maxRecordsExceeded: (maxRecords: string) => `Trop d'enregistrements. Maximum autorisé : ${maxRecords}`,
    dropzone: {
      title: "Téléverser un fichier .xlsx, .xls ou .csv",
      errorToastDescription: "téléversement rejeté",
      activeDropzoneTitle: "Déposez le fichier ici...",
      buttonTitle: "Sélectionner un fichier",
      loadingTitle: "Traitement en cours...",
    },
    selectSheet: {
      title: "Sélectionner la feuille à utiliser",
      nextButtonTitle: "Suivant",
      backButtonTitle: "Retour",
    },
  },
  selectHeaderStep: {
    title: "Sélectionner la ligne d’en-tête",
    nextButtonTitle: "Suivant",
    backButtonTitle: "Retour",
  },
  matchColumnsStep: {
    title: "Faire correspondre les colonnes",
    nextButtonTitle: "Suivant",
    backButtonTitle: "Retour",
    userTableTitle: "Votre tableau",
    templateTitle: "Deviendra",
    selectPlaceholder: "Sélectionner une colonne...",
    ignoredColumnText: "Colonne ignorée",
    subSelectPlaceholder: "Sélectionner...",
    matchDropdownTitle: "Faire correspondre",
    unmatched: "Non associé",
    duplicateColumnWarningTitle: "Une autre colonne est déjà sélectionnée",
    duplicateColumnWarningDescription: "Les colonnes ne peuvent pas être dupliquées",
  },
  validationStep: {
    title: "Valider les données",
    nextButtonTitle: "Confirmer",
    backButtonTitle: "Retour",
    noRowsMessage: "Aucune donnée trouvée",
    noRowsMessageWhenFiltered: "Aucune donnée contenant des erreurs",
    discardButtonTitle: "Ignorer les lignes sélectionnées",
    filterSwitchTitle: "Afficher uniquement les lignes contenant des erreurs",
  },
  alerts: {
    confirmClose: {
      headerTitle: "Quitter l'importation",
      bodyText: "Êtes-vous sûr(e) ? Vos informations actuelles ne seront pas sauvegardées.",
      cancelButtonTitle: "Annuler",
      exitButtonTitle: "Quitter",
    },
    submitIncomplete: {
      headerTitle: "Erreurs détectées",
      bodyText: "Certaines lignes contiennent encore des erreurs. Les lignes erronées seront ignorées lors de l'envoi.",
      bodyTextSubmitForbidden: "Certaines lignes contiennent encore des erreurs.",
      cancelButtonTitle: "Annuler",
      finishButtonTitle: "Soumettre",
    },
    submitError: {
      title: "Erreur",
      defaultMessage: "Une erreur est survenue lors de l'envoi des données",
    },
    unmatchedRequiredFields: {
      headerTitle: "Toutes les colonnes ne sont pas associées",
      bodyText: "Certaines colonnes obligatoires ne sont pas associées ou sont ignorées. Voulez-vous continuer ?",
      listTitle: "Colonnes non associées :",
      cancelButtonTitle: "Annuler",
      continueButtonTitle: "Continuer",
    },
    toast: {
      error: "Erreur",
    },
  },
}

export type TranslationsRSIProps = DeepPartial<typeof translations>
export type Translations = typeof translations
