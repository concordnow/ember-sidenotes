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
