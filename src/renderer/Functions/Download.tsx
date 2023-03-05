export default function handleOnDownClicked(e: any) {
  e.preventDefault();
  window.electron.downloadOriginalDaggerfall({
    name: 'downloadOriginalDaggerfall',
    payload: undefined,
  });
}
