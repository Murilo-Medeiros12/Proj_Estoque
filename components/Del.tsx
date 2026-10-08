export default function Del({ action, id }: { action: (f: FormData) => Promise<void>; id: number }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="text-red-600 cursor-pointer">Excluir</button>
    </form>
  );
}