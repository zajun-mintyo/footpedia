import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '無料サッカー作戦盤（戦術ボード・フォーメーション作成アプリ）| FootPedia',
  description: 'ブラウザですぐ使える登録不要・無料のWebサッカー作戦盤（タクティクスボード）。歴代レジェンド・日本代表選手を配置したベストイレブン・フォーメーション作成や、矢印・ライン描画、画像保存に対応。',
  keywords: ['サッカー 作戦盤 無料', 'サッカー 作戦ボード Web', '戦術ボード アプリ', 'サッカー フォーメーション 作成', 'ベストイレブン 作成', 'FootPedia', 'フットペディア'],
  alternates: {
    canonical: 'https://footpedia-weld.vercel.app/board',
  },
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
