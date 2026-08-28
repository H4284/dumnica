export const loc = (field: string) =>
  `select(
    $locale == "en" => coalesce(${field}.en, ${field}.sq),
    $locale == "de" => coalesce(${field}.de, ${field}.sq),
    ${field}.sq
  )`;

export const locList = (field: string) =>
  `${field}[]{
    "v": select(
      $locale == "en" => coalesce(@.en, @.sq),
      $locale == "de" => coalesce(@.de, @.sq),
      @.sq
    )
  }.v`;

export const locBlock = (field: string) =>
  `select(
    $locale == "en" => coalesce(${field}.en, ${field}.sq),
    $locale == "de" => coalesce(${field}.de, ${field}.sq),
    ${field}.sq
  )`;
