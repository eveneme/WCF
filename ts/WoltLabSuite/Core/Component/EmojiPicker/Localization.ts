/**
 * This file is auto-generated, DO NOT MODIFY IT MANUALLY!
 *
 * To update the file, run in the extra directory:
 * > `npx tsx ./update-emoji-picker-element.ts ../wcfsetup/install/files/emoji ../ts/WoltLabSuite/Core/Component/EmojiPicker/Localization.ts`
 *
 * @woltlabExcludeBundle all
 */

import { I18n } from "emoji-picker-element/shared";

// prettier-ignore
const locales = [
  "da","nl","en","en-gb","et","fi","fr","de","hu","it","lt","nb","pl","pt","ru","es","sv","uk"
];

export function getLocalizationData(localization: string): I18n {
  if (localization.includes("-")) {
    localization = localization.split("-")[0];
  }

  switch (localization) {
    case "nl":
      // prettier-ignore
      return {"categoriesLabel":"Categorieën","emojiUnsupportedMessage":"Uw browser ondersteunt geen kleurenemoji.","favoritesLabel":"Favorieten","loadingMessage":"Bezig met laden…","networkErrorMessage":"Kan emoji niet laden.","regionLabel":"Emoji-kiezer","searchDescription":"Als er zoekresultaten beschikbaar zijn, drukt u op omhoog of omlaag om te selecteren en op enter om te kiezen.","searchLabel":"Zoeken","searchResultsLabel":"Zoekresultaten","skinToneDescription":"Wanneer uitgevouwen, druk omhoog of omlaag om te selecteren en enter om te kiezen.","skinToneLabel":"Kies een huidskleur (momenteel {skinTone})","skinTonesLabel":"Huidskleuren","skinTones":["Standaard","Licht","Medium-Licht","Medium","Middeldonker","Donker"],"categories":{"custom":"Aangepast","smileys-emotion":"Smileys en emoticons","people-body":"Mensen en lichaam","animals-nature":"Dieren en natuur","food-drink":"Eten en drinken","travel-places":"Reizen en plaatsen","activities":"Activiteiten","objects":"Voorwerpen","symbols":"Symbolen","flags":"Vlaggen"}};
    case "fr":
      // prettier-ignore
      return {"categoriesLabel":"Catégories","emojiUnsupportedMessage":"Votre navigateur ne supporte pas les emojis en couleur.","favoritesLabel":"Favoris","loadingMessage":"Chargement en cours…","networkErrorMessage":"Impossible de charger les emojis.","regionLabel":"Choisir un emoji","searchDescription":"Lorsque les résultats sont affichés, utilisez les flèches haut/bas pour naviguer et la touche entrée pour sélectionner.","searchLabel":"Rechercher","searchResultsLabel":"Résultats","skinToneDescription":"Quand disponible, utilisez les flèches haut/bas pour naviguer et la touche entrée pour sélectionner.","skinToneLabel":"Choisir une couleur de peau (actuellement {skinTone})","skinTonesLabel":"Couleurs de peau","skinTones":["Par défaut","Clair","Moyennement clair","Moyen","Moyennement sombre","Sombre"],"categories":{"custom":"Personnalisé","smileys-emotion":"Émoticônes","people-body":"Corps et métiers","animals-nature":"Animaux et nature","food-drink":"Nourriture et boissons","travel-places":"Voyages et lieux","activities":"Activités","objects":"Objets","symbols":"Symboles","flags":"Drapeaux"}};
    case "de":
      // prettier-ignore
      return {"categoriesLabel":"Kategorien","emojiUnsupportedMessage":"Dein Browser unterstützt keine farbigen Emojis.","favoritesLabel":"Favoriten","loadingMessage":"Wird geladen…","networkErrorMessage":"Konnte Emoji nicht laden.","regionLabel":"Emoji auswählen","searchDescription":"Wenn Suchergebnisse verfügbar sind, wähle sie mit Pfeil rauf und runter, dann Eingabetaste, aus.","searchLabel":"Suchen","searchResultsLabel":"Suchergebnisse","skinToneDescription":"Wenn angezeigt, nutze Pfeiltasten rauf und runter zum Auswählen, Eingabe zum Akzeptieren.","skinToneLabel":"Wähle einen Hautton (aktuell {skinTone})","skinTonesLabel":"Hauttöne","skinTones":["Standard","Hell","Mittel-hell","Mittel","Mittel-dunkel","Dunkel"],"categories":{"custom":"Benutzerdefiniert","smileys-emotion":"Smileys und Emoticons","people-body":"Menschen und Körper","animals-nature":"Tiere und Natur","food-drink":"Essen und Trinken","travel-places":"Reisen und Orte","activities":"Aktivitäten","objects":"Objekte","symbols":"Symbole","flags":"Flaggen"}};
    case "it":
      // prettier-ignore
      return {"categoriesLabel":"Categorie","emojiUnsupportedMessage":"Il tuo browser non supporta le emoji colorate.","favoritesLabel":"Preferiti","loadingMessage":"Caricamento...","networkErrorMessage":"Impossibile caricare le emoji.","regionLabel":"Selezione emoji","searchDescription":"Quando i risultati della ricerca sono disponibili, premi su o giù per selezionare e invio per scegliere.","searchLabel":"Cerca","searchResultsLabel":"Risultati di ricerca","skinToneDescription":"Quando espanso, premi su o giù per selezionare e invio per scegliere.","skinToneLabel":"Scegli una tonalità della pelle (corrente {skinTone})","skinTonesLabel":"Tonalità della pelle","skinTones":["Predefinita","Chiara","Medio-Chiara","Media","Medio-Scura","Scura"],"categories":{"custom":"Personalizzata","smileys-emotion":"Faccine ed emozioni","people-body":"Persone e corpi","animals-nature":"Animali e natura","food-drink":"Cibi e bevande","travel-places":"Viaggi e luoghi","activities":"Attività","objects":"Oggetti","symbols":"Simboli","flags":"Bandiere"}};
    case "pl":
      // prettier-ignore
      return {"categoriesLabel":"Kategorie","emojiUnsupportedMessage":"Twoja przeglądarka nie wspiera kolorowych emotikon.","favoritesLabel":"Ulubione","loadingMessage":"Ładuję…","networkErrorMessage":"Nie można załadować emoji.","regionLabel":"Selektor emoji","searchDescription":"Kiedy wyniki wyszukiwania będą dostępne, wciśnij góra lub dół aby wybrać oraz enter aby zatwierdzić wybór.","searchLabel":"Wyszukaj","searchResultsLabel":"Wyniki wyszukiwania","skinToneDescription":"Po rozwinięciu wciśnij góra lub dół aby wybrać oraz enter aby zatwierdzić wybór.","skinToneLabel":"Wybierz odcień skóry (aktualnie {skinTone})","skinTonesLabel":"Odcienie skóry","skinTones":["Domyślna","Jasna","Średnio-jasna","Średnia","Średnio-ciemna","Ciemna"],"categories":{"custom":"Własne","smileys-emotion":"Uśmiechy","people-body":"Ludzie","animals-nature":"Zwierzęta i natura","food-drink":"Żywność i napoje","travel-places":"Podróże i miejsca","activities":"Aktywności","objects":"Obiekty","symbols":"Symbole","flags":"Flagi"}};
    case "pt":
      // prettier-ignore
      return {"categoriesLabel":"Categorias","emojiUnsupportedMessage":"O seu browser não suporta emojis.","favoritesLabel":"Favoritos","loadingMessage":"A Carregar…","networkErrorMessage":"Não foi possível carregar o emoji.","regionLabel":"Emoji picker","searchDescription":"Quando os resultados da pesquisa estiverem disponíveis, pressione para cima ou para baixo para selecionar e digite para escolher.","searchLabel":"Procurar","searchResultsLabel":"Resultados da procura","skinToneDescription":"Quando expandido, pressione para cima ou para baixo para selecionar e digite para escolher.","skinToneLabel":"Escolha um tom de pele (atual {skinTone})","skinTonesLabel":"Tons de pele","skinTones":["Pré-definido","Claro","Médio-Claro","Médio","Médio-Escuro","Escuro"],"categories":{"custom":"Personalizados","smileys-emotion":"Smileys e emoticons","people-body":"Pessoas e corpo","animals-nature":"Animais e natureza","food-drink":"Comida e bebida","travel-places":"Viagens e locais","activities":"Atividades","objects":"Objetos","symbols":"Símbolos","flags":"Bandeiras"}};
    case "ru":
      // prettier-ignore
      return {"categoriesLabel":"Категории","emojiUnsupportedMessage":"Ваш браузер не поддерживает цветные эмодзи.","favoritesLabel":"Избранное","loadingMessage":"Загрузка…","networkErrorMessage":"Не удалось загрузить эмодзи. Попробуйте перезагрузить страницу.","regionLabel":"Выберите эмодзи","searchDescription":"Когда результаты поиска станут доступны, выберите их с помощью стрелок вверх и вниз, затем нажмите для подтверждения.","searchLabel":"Искать","searchResultsLabel":"Результаты поиска","skinToneDescription":"При отображении используйте клавиши со стрелками вверх и вниз для выбора, нажмите для подтверждения.","skinToneLabel":"Выберите оттенок кожи (текущий {skinTone})","skinTonesLabel":"Оттенки кожи","skinTones":["Стандартный","Светлый","Средне-светлый","Средний","Средне-темный","Темный"],"categories":{"custom":"Пользовательский","smileys-emotion":"Смайлики и Эмотиконы","people-body":"Люди и Тела","animals-nature":"Животные и Природа","food-drink":"Еда и Напитки","travel-places":"Путешествия и Места","activities":"Виды деятельности","objects":"Объекты","symbols":"Символы","flags":"Флаги"}};
    case "es":
      // prettier-ignore
      return {"categoriesLabel":"Categorías","emojiUnsupportedMessage":"El navegador no admite emojis de color.","favoritesLabel":"Favoritos","loadingMessage":"Cargando…","networkErrorMessage":"No se pudo cargar el emoji.","regionLabel":"Selector de emojis","searchDescription":"Cuando estén disponibles los resultados, pulsa la tecla hacia arriba o hacia abajo para seleccionar y la tecla intro para elegir.","searchLabel":"Buscar","searchResultsLabel":"Resultados de búsqueda","skinToneDescription":"Cuando se abran las opciones, pulsa la tecla hacia arriba o hacia abajo para seleccionar y la tecla intro para elegir.","skinToneLabel":"Elige un tono de piel ({skinTone} es el actual)","skinTonesLabel":"Tonos de piel","skinTones":["Predeterminado","Claro","Claro medio","Medio","Oscuro medio","Oscuro"],"categories":{"custom":"Personalizado","smileys-emotion":"Emojis y emoticones","people-body":"Personas y partes del cuerpo","animals-nature":"Animales y naturaleza","food-drink":"Comida y bebida","travel-places":"Viajes y lugares","activities":"Actividades","objects":"Objetos","symbols":"Símbolos","flags":"Banderas"}};
    default:
      // prettier-ignore
      return {"categoriesLabel":"Categories","emojiUnsupportedMessage":"Your browser does not support color emoji.","favoritesLabel":"Favorites","loadingMessage":"Loading…","networkErrorMessage":"Could not load emoji.","regionLabel":"Emoji picker","searchDescription":"When search results are available, press up or down to select and enter to choose.","searchLabel":"Search","searchResultsLabel":"Search results","skinToneDescription":"When expanded, press up or down to select and enter to choose.","skinToneLabel":"Choose a skin tone (currently {skinTone})","skinTonesLabel":"Skin tones","skinTones":["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],"categories":{"custom":"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places","activities":"Activities","objects":"Objects","symbols":"Symbols","flags":"Flags"}};
  }
}

export function getDataSource(locale: string): string {
  if (!locales.includes(locale)) {
    return `${window.WSC_API_URL}emoji/en.json`;
  }

  return `${window.WSC_API_URL}emoji/${locale}.json`;
}