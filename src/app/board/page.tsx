import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'サッカーボードアプリ（作戦盤）- Footpedia',
  description: '歴代500名のレジェンド選手を自由に配置してドリームチームを結成できる、無料のデジタルタクティクスボード。矢印やライン、フォーメーション作成機能付き。',
};

export default function BoardPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 p-0 m-0">
      <iframe
        src="/tactics_board.html"
        className="w-full h-full border-0 block"
        title="Foopedia サッカーボード盤"
      />
    </main>
  );
}
