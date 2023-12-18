export function getNotesIdealPlacement(notes, activeNoteId, gutter) {
  const activeNote = notes.find(({ id }) => activeNoteId === id) || notes[0];
  const activeNoteIndex = notes.indexOf(activeNote);

  const notesBefore = notes
    .slice(0, activeNoteIndex + 1)
    .reduceRight((acc, note) => {
      const prevNote = acc[acc.length - 1];
      const { element, offsetY } = note;

      const top =
        Math.min(prevNote?.top - element.offsetHeight - gutter, offsetY) ||
        offsetY;

      return [...acc, { top, note }];
    }, []);

  const notesAfter = notes.slice(activeNoteIndex).reduce((acc, note) => {
    const prevNote = acc[acc.length - 1];
    const { offsetY } = note;

    const top =
      Math.max(
        prevNote?.top + prevNote?.note.element.offsetHeight + gutter,
        offsetY
      ) || offsetY;

    return [...acc, { top, note }];
  }, []);

  return [...notesBefore.reverse(), ...notesAfter.splice(1)];
}

export function getNotesIdealPlacementPrev(
  notes,
  activeNoteId,
  gutter,
  estimatedHeight
) {
  const activeNote = notes.find(({ id }) => activeNoteId === id) || notes[0];
  const activeNoteIndex = notes.indexOf(activeNote);

  const notesBefore = notes
    .slice(0, activeNoteIndex + 1)
    .reduceRight((acc, note) => {
      const prevNote = acc[acc.length - 1];
      const { offsetBottomFirstLine } = note;

      const top =
        Math.min(
          prevNote?.top - estimatedHeight - gutter,
          offsetBottomFirstLine
        ) || offsetBottomFirstLine;

      return [...acc, { top, note }];
    }, []);

  const notesAfter = notes.slice(activeNoteIndex).reduce((acc, note) => {
    const prevNote = acc[acc.length - 1];
    const { offsetBottomFirstLine } = note;

    const top =
      Math.max(
        prevNote?.top + estimatedHeight + gutter,
        offsetBottomFirstLine
      ) || offsetBottomFirstLine;

    return [...acc, { top, note }];
  }, []);

  return [...notesBefore.reverse(), ...notesAfter.splice(1)];
}
