# Editorial Review 50

Objectif: reprendre 50 pages bloquees par le garde-fou qualite et les amener au niveau premium des pages Marc Touati et Bernard Stiegler.

## Regles

- Utiliser uniquement les transcripts YouTube locaux dans `data/transcripts`.
- Ne pas transcrire soi-meme depuis l'audio.
- Ne pas publier une page dont le transcript est absent ou inexploitable.
- Ne pas utiliser de texte-gabarit, de remplissage ou de titres generiques.
- Ne pas baisser le niveau pour tenir le volume.
- Ne publier le lot que lorsque les 50 pages passent la validation.
- Ne pas refaire une page dont le fichier `data/editorial-summaries/VIDEO_ID.json` atteint deja le niveau premium.
- Ne pas utiliser de script pour generer la synthese editoriale. Les scripts servent seulement a inspecter, suivre, auditer, fusionner et publier.

## Scripts interdits pour ce chantier

Ne pas utiliser ces commandes pour produire les 50 resumes:

```powershell
npm run summaries:generate
node scripts\generate-local-editorial-summaries.mjs
node scripts\regenerate-premium-local-summaries.mjs
```

Ces scripts peuvent rester dans le depot pour l'historique technique, mais ils ne produisent pas le niveau editorial attendu.

## Definition Premium

Chaque page terminee doit avoir:

- un `executive_summary` long, avec 10 idees fortes environ;
- un `youth_advice` substantiel et specifique a l'entretien;
- au moins 5 recommandations de lecture ou sources coherentes;
- au moins 10 sections;
- au moins 24 paragraphes;
- une progression qui suit l'ordre du transcript;
- une conservation des arguments, exemples, tensions et nuances de l'invite;
- une `method_note` qui cite le transcript local utilise;
- aucun marqueur mecanique ou phrase de remplissage.

## Workflow

1. Initialiser ou consulter la queue:

   ```powershell
   npm run editorial:50:status
   npm run editorial:50:next 5
   ```

2. Lire le transcript d'une page avant redaction:

   ```powershell
   node scripts\inspect-transcript-chunks.mjs VIDEO_ID
   ```

3. Remplacer le fichier:

   ```text
   data/editorial-summaries/VIDEO_ID.json
   ```

4. Auditer regulierement les pages reprises:

   ```powershell
   npm run summaries:audit VIDEO_ID
   npm run editorial:50:status
   ```

5. Quand les 50 pages sont pretes:

   ```powershell
   npm run editorial:50:validate
   npm run summaries:merge
   npm run build
   ```

6. Publier seulement apres validation complete:

   ```powershell
   git add data/editorial-summaries data/interviews.json data/editorial-review-50.json docs/editorial-review-50.md scripts/editorial-review-50.mjs package.json
   git commit -m "Rewrite 50 blocked editorial summaries"
   git push
   npx vercel --prod --yes
   ```

## Ordre de travail autonome

Travailler par sous-lots de 5 pages, sans publication intermediaire:

1. `npm run editorial:50:next 5`
2. Lire les 5 transcripts avec `inspect-transcript-chunks`.
3. Rediger manuellement les 5 JSON premium.
4. Lancer `npm run summaries:audit` sur ces 5 IDs.
5. Lancer `npm run editorial:50:status`.
6. Passer aux 5 suivantes seulement si les 5 precedentes sont `ready_unmerged`.

Quand `editorial:50:status` indique `ready_unmerged=50`, lancer seulement alors:

```powershell
npm run editorial:50:validate
npm run summaries:merge
npm run build
```

## Suivi

La queue stable se trouve dans:

```text
data/editorial-review-50.json
```

Le statut `ready_unmerged` signifie que le JSON premium local est pret, mais que `data/interviews.json` n'a pas encore forcement ete regenere par `summaries:merge`.
