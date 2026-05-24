import type { TrackId, CategoryId } from "@/lib/types";

// ===========================================================================
// CRUD 実践課題 (Crud Challenge) の型定義
//
// 既存の `practical` カテゴリ (1 問完結の短文型) とは別物。
// 実務想定の機能を、シナリオ → データモデル → API → 段階的ステップ
// → レビュー観点 → 発展課題、の流れで「読みながら手元で実装する」
// 形式の教材。
// ===========================================================================

export type CrudSampleCode = {
  label: string;
  language: string;
  code: string;
  filename?: string;
};

export type CrudStep = {
  id: string;
  /** ステップタイトル */
  title: string;
  /** このステップで達成したいこと (1〜2 行) */
  goal: string;
  /** 説明本文 (改行を含むプレーンテキスト) */
  instructions: string;
  /** 触るファイル一覧 (任意) */
  files?: { path: string; purpose: string }[];
  /** 実行コマンド例 */
  commandHints?: string[];
  /** サンプルコード (複数可) */
  sampleCode?: CrudSampleCode[];
  /** 完了チェック項目 */
  checkpoints: string[];
  /** このステップのレビュー観点 */
  reviewPoints?: string[];
};

export type CrudColumn = {
  name: string;
  type: string;
  notes?: string;
};

export type CrudModel = {
  name: string;
  description: string;
  columns: CrudColumn[];
};

export type CrudEndpoint = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  description: string;
  request?: string;
  response?: string;
};

export type CrudChallenge = {
  id: string;
  trackId: TrackId;
  /** 課題名 */
  title: string;
  /** 1 行サマリ (一覧用) */
  subtitle: string;
  /** シナリオ (なぜ作るのか、どんな機能か) */
  scenario: string;
  /** 想定読者 */
  audience: string;
  /** 目安時間 (分) */
  estimateMinutes: number;
  /** 難易度 */
  difficulty: "beginner" | "intermediate" | "advanced";
  emoji: string;
  /** スタック (Rails 7 + RSpec 等) */
  stack: string[];
  /** データモデル (テーブル) */
  dataModels: CrudModel[];
  /** API エンドポイント (REST) */
  apiEndpoints?: CrudEndpoint[];
  /** 段階的実装ステップ */
  steps: CrudStep[];
  /** 全体のレビューチェックリスト */
  reviewChecklist: string[];
  /** 発展課題 */
  stretch?: string[];
  /** 参考リンク */
  references?: { label: string; url: string }[];
  /** 関連カテゴリ (定着用クイズ) */
  relatedCategoryIds?: CategoryId[];
};

// ===========================================================================
// 課題データ
// ===========================================================================

export const crudChallenges: CrudChallenge[] = [
  // ---------- 1. Rails ToDo CRUD ----------
  {
    id: "rails-todo-crud",
    trackId: "ruby",
    title: "Rails ToDo CRUD — RESTful な王道一周",
    subtitle:
      "Rails 7.x で ToDo 管理機能をフルスクラッチ。Migration / Model / Routes / Controller / View / RSpec まで一周する。",
    scenario:
      "あなたは社内向け簡易タスク管理ツールの新規機能開発を任された。最初の機能として『個人 ToDo の CRUD』を Rails 7.x で実装する。scaffold は使わず、各レイヤを意識的に書くことでフレームワークの規約と責務分担を体得することがゴール。",
    audience:
      "Rails ガイドを一通り読んだ / scaffold は触ったことがあるが、手書きで一通り書けるか怪しい人",
    estimateMinutes: 90,
    difficulty: "beginner",
    emoji: "✅",
    stack: ["Ruby 3.2+", "Rails 7.1+", "SQLite or PostgreSQL", "RSpec", "FactoryBot"],
    relatedCategoryIds: [
      "rails-convention",
      "routing-controller",
      "active-record",
      "rspec",
    ],
    dataModels: [
      {
        name: "Todo",
        description: "ユーザーが管理する 1 件のタスク",
        columns: [
          { name: "id", type: "bigint", notes: "PK (自動)" },
          { name: "title", type: "string", notes: "NOT NULL, 1..120 文字" },
          {
            name: "description",
            type: "text",
            notes: "任意。最大 2000 文字程度",
          },
          {
            name: "status",
            type: "integer (enum)",
            notes: "0:todo / 1:doing / 2:done。デフォルト 0",
          },
          {
            name: "due_on",
            type: "date",
            notes: "任意。過去日も許可するが警告は将来課題",
          },
          { name: "created_at", type: "datetime", notes: "Rails 自動" },
          { name: "updated_at", type: "datetime", notes: "Rails 自動" },
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/todos",
        description: "一覧。status で絞り込み可 (?status=todo|doing|done)",
        response: "200: HTML (index ビュー) or JSON 配列",
      },
      {
        method: "GET",
        path: "/todos/:id",
        description: "詳細",
        response: "200: HTML or JSON",
      },
      {
        method: "GET",
        path: "/todos/new",
        description: "新規作成フォーム",
      },
      {
        method: "POST",
        path: "/todos",
        description: "新規作成",
        request: "todo[title], todo[description], todo[status], todo[due_on]",
        response: "成功: 302 → /todos/:id / 失敗: 422 + new ビュー",
      },
      {
        method: "GET",
        path: "/todos/:id/edit",
        description: "編集フォーム",
      },
      {
        method: "PATCH",
        path: "/todos/:id",
        description: "更新",
        response: "成功: 302 / 失敗: 422 + edit ビュー",
      },
      {
        method: "DELETE",
        path: "/todos/:id",
        description: "削除",
        response: "302 → /todos",
      },
    ],
    steps: [
      // ----- Step 1 -----
      {
        id: "01-bootstrap",
        title: "ステップ 1: アプリ雛形と DB の準備",
        goal: "新規 Rails アプリを作り、開発 DB が立ち上がる状態にする。",
        instructions:
          "scaffold は使わず、ベアな Rails アプリを起こす。SQLite で十分。db:create まで通れば OK。\n\nここで重要なのは『1 行ずつコマンドが何をしているか』を説明できるようになること。`rails new` の `-T` で test-unit を無効化、`--skip-bundle` で初期 bundle を後回しにする選択肢など、フラグの意味を意識する。",
        commandHints: [
          "rails new todo_app -T --database=sqlite3",
          "cd todo_app",
          "bundle add rspec-rails factory_bot_rails --group=development,test",
          "bin/rails g rspec:install",
          "bin/rails db:create",
        ],
        files: [
          { path: "Gemfile", purpose: "rspec-rails / factory_bot_rails 追加先" },
          { path: "config/database.yml", purpose: "DB 設定" },
          { path: "spec/rails_helper.rb", purpose: "RSpec 初期化" },
        ],
        checkpoints: [
          "bin/rails s でトップが 200 を返す (Rails のデフォルトページ)",
          "bin/rspec が 0 examples で通る",
          "bin/rails db:create が成功する",
        ],
        reviewPoints: [
          "なぜ -T を付けたか説明できる (test-unit を無効化し RSpec を使う宣言)",
          "factory_bot_rails が development には不要に見えるが、`bin/rails g` 系で FactoryBot のひな形を出すために含める",
        ],
      },
      // ----- Step 2 -----
      {
        id: "02-migration",
        title: "ステップ 2: Migration とテーブル設計",
        goal:
          "Todo テーブルを作成し、必要な NOT NULL / 既定値 / index を設定する。",
        instructions:
          "Migration ファイルでは Ruby DSL でスキーマを表現する。NOT NULL / default は **DB レベル**でかける癖を付けると、後で並行プロセスから壊れにくくなる (アプリ層のバリデーションだけだとレースで抜ける)。",
        commandHints: [
          "bin/rails g migration CreateTodos title:string description:text status:integer due_on:date",
          "bin/rails db:migrate",
        ],
        files: [
          {
            path: "db/migrate/<timestamp>_create_todos.rb",
            purpose: "テーブル定義",
          },
          { path: "db/schema.rb", purpose: "現在のスキーマ (自動)" },
        ],
        sampleCode: [
          {
            label: "Migration",
            language: "ruby",
            filename: "db/migrate/20260101_create_todos.rb",
            code: `class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string  :title,       null: false, limit: 120
      t.text    :description
      t.integer :status,      null: false, default: 0
      t.date    :due_on

      t.timestamps
    end

    add_index :todos, :status
    add_index :todos, :due_on
  end
end`,
          },
        ],
        checkpoints: [
          "db:migrate が通り、schema.rb に todos テーブルが反映される",
          "title が NOT NULL になっている",
          "status のデフォルトが 0",
          "status / due_on に index が貼られている",
        ],
        reviewPoints: [
          "なぜ index を貼ったか (絞り込み・並び替えで使う列だから)",
          "DB レベルの制約とアプリのバリデーションは両方かける (二重防御)",
        ],
      },
      // ----- Step 3 -----
      {
        id: "03-model",
        title: "ステップ 3: Model + バリデーション + enum",
        goal:
          "Todo モデルに enum とバリデーションを実装し、ビジネスルールをコードで表現する。",
        instructions:
          "Rails の `enum` はマジックメソッド (`todo.done!`, `Todo.doing`) を生成する。文字列キーを DB に持つか整数キーを持つかは古典的な議論があるが、ここでは整数 + ラベルマッピング (Rails のデフォルト挙動) を採用する。",
        files: [
          { path: "app/models/todo.rb", purpose: "Todo モデル" },
          {
            path: "spec/factories/todos.rb",
            purpose: "FactoryBot のひな形",
          },
        ],
        sampleCode: [
          {
            label: "Model",
            language: "ruby",
            filename: "app/models/todo.rb",
            code: `class Todo < ApplicationRecord
  enum status: { todo: 0, doing: 1, done: 2 }

  validates :title, presence: true, length: { maximum: 120 }
  validates :description, length: { maximum: 2000 }, allow_blank: true

  scope :recent, -> { order(created_at: :desc) }
  scope :due_soon, -> { where(due_on: ..Date.current + 3.days) }
end`,
          },
          {
            label: "Factory",
            language: "ruby",
            filename: "spec/factories/todos.rb",
            code: `FactoryBot.define do
  factory :todo do
    sequence(:title) { |n| "Task #{n}" }
    description { "Sample description" }
    status       { :todo }
    due_on       { 3.days.from_now.to_date }
  end
end`,
          },
        ],
        checkpoints: [
          "Todo.new(title: nil).valid? が false",
          "Todo.statuses が { 'todo' => 0, 'doing' => 1, 'done' => 2 } を返す",
          "FactoryBot.build(:todo).valid? が true",
        ],
        reviewPoints: [
          "scope は再利用される検索条件を 1 か所にまとめる手段。コントローラから直接 where(...) を書き散らかさない",
          "enum のキーは将来追加されうるが、削除・並び替えは慎重に (整数値が変わるとデータが壊れる)",
        ],
      },
      // ----- Step 4 -----
      {
        id: "04-routes",
        title: "ステップ 4: RESTful Routes",
        goal: "resources :todos で 7 つのアクションのルートを宣言する。",
        instructions:
          "`resources :todos` 1 行で REST 7 アクションのルートが生成される。これが Rails の Convention over Configuration を最も体感できる箇所。`bin/rails routes -g todos` で生成結果を確認する習慣を付ける。",
        files: [{ path: "config/routes.rb", purpose: "ルート定義" }],
        sampleCode: [
          {
            label: "Routes",
            language: "ruby",
            filename: "config/routes.rb",
            code: `Rails.application.routes.draw do
  root to: redirect("/todos")
  resources :todos
end`,
          },
        ],
        commandHints: ["bin/rails routes -g todos"],
        checkpoints: [
          "GET /todos, POST /todos, GET /todos/:id, GET /todos/new, GET /todos/:id/edit, PATCH/PUT /todos/:id, DELETE /todos/:id が表示される",
          "named route helper として todos_path / todo_path(@todo) / new_todo_path / edit_todo_path(@todo) が使えるようになる",
        ],
        reviewPoints: [
          "resources で生成されるのは 7 つだけ。それ以外 (search 等) は member/collection で明示的に増やす",
          "URL 設計に迷ったら『RESTful に矯正する』のがコスト最小。動詞 (do, send 等) は URL ではなく状態遷移として表現する",
        ],
      },
      // ----- Step 5 -----
      {
        id: "05-controller",
        title: "ステップ 5: Controller + Strong Parameters",
        goal:
          "7 アクションを実装し、before_action と strong params で重複と脆弱性を抑える。",
        instructions:
          "コントローラの責務は『リクエストの仕分けとレスポンスの組み立て』。ビジネスロジックや永続化条件はモデルに寄せる。Strong Parameters は不正な mass-assignment を防ぐための必須の盾。",
        files: [
          {
            path: "app/controllers/todos_controller.rb",
            purpose: "ToDo コントローラ",
          },
        ],
        sampleCode: [
          {
            label: "Controller",
            language: "ruby",
            filename: "app/controllers/todos_controller.rb",
            code: `class TodosController < ApplicationController
  before_action :set_todo, only: %i[show edit update destroy]

  def index
    @todos = Todo.recent
    @todos = @todos.where(status: params[:status]) if params[:status].present?
  end

  def show; end

  def new
    @todo = Todo.new
  end

  def create
    @todo = Todo.new(todo_params)
    if @todo.save
      redirect_to @todo, notice: "作成しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @todo.update(todo_params)
      redirect_to @todo, notice: "更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @todo.destroy
    redirect_to todos_path, notice: "削除しました", status: :see_other
  end

  private

  def set_todo
    @todo = Todo.find(params[:id])
  end

  def todo_params
    params.require(:todo).permit(:title, :description, :status, :due_on)
  end
end`,
          },
        ],
        checkpoints: [
          "未許可キーをフォームに混ぜても無視される (例: params[:todo][:admin] = true)",
          "保存失敗時に 422 が返り new/edit が再描画される",
          "destroy 後のリダイレクトが 303 See Other (Turbo の作法)",
        ],
        reviewPoints: [
          "before_action で @todo セットを集約 → 4 アクション分の重複を消せる",
          "params[:status] を where に渡す前に enum で許可される値かチェックすべき (将来の堅牢化ポイント)",
          "mass-assignment 防止のため、permit に列挙したものだけが通る",
        ],
      },
      // ----- Step 6 -----
      {
        id: "06-views",
        title: "ステップ 6: View / form_with / partial",
        goal:
          "form_with + 共通フォーム partial + flash + バリデーションエラー表示を実装する。",
        instructions:
          "new と edit のフォームは同一なので partial に切り出す。form_with は @todo の状態 (new_record? か persisted? か) で自動的に POST / PATCH を切り替える。エラー時は @todo.errors を表示する。",
        files: [
          { path: "app/views/todos/index.html.erb", purpose: "一覧" },
          { path: "app/views/todos/show.html.erb", purpose: "詳細" },
          { path: "app/views/todos/new.html.erb", purpose: "新規" },
          { path: "app/views/todos/edit.html.erb", purpose: "編集" },
          { path: "app/views/todos/_form.html.erb", purpose: "共通フォーム" },
          { path: "app/views/layouts/application.html.erb", purpose: "flash 表示の置き場所" },
        ],
        sampleCode: [
          {
            label: "共通フォーム",
            language: "erb",
            filename: "app/views/todos/_form.html.erb",
            code: `<%= form_with(model: todo, local: true) do |f| %>
  <% if todo.errors.any? %>
    <ul class="errors">
      <% todo.errors.full_messages.each do |msg| %>
        <li><%= msg %></li>
      <% end %>
    </ul>
  <% end %>

  <div><%= f.label :title %><%= f.text_field :title %></div>
  <div><%= f.label :description %><%= f.text_area :description %></div>
  <div>
    <%= f.label :status %>
    <%= f.select :status, Todo.statuses.keys.map { |k| [k, k] } %>
  </div>
  <div><%= f.label :due_on %><%= f.date_field :due_on %></div>

  <%= f.submit %>
<% end %>`,
          },
          {
            label: "一覧",
            language: "erb",
            filename: "app/views/todos/index.html.erb",
            code: `<h1>ToDo (<%= @todos.count %>)</h1>

<%= link_to "新規作成", new_todo_path %>

<ul>
  <% @todos.each do |todo| %>
    <li>
      [<%= todo.status %>] <%= link_to todo.title, todo %>
      <%= " due: #{todo.due_on}" if todo.due_on %>
    </li>
  <% end %>
</ul>`,
          },
        ],
        checkpoints: [
          "/todos/new でフォーム表示、submit で /todos/:id にリダイレクト",
          "title 空で submit すると 422 + エラーリストが表示される",
          "destroy リンクから削除でき、flash『削除しました』が表示される",
        ],
        reviewPoints: [
          "form_with は railsguides では `local: true` を明示しない例が多いが、Turbo 利用方針はアプリで統一すべき",
          "flash は layout 側で 1 か所に集約する",
          "view 内に長いビジネスロジック (if 多重) が増えてきたら ViewObject / Helper に寄せるサインを意識する",
        ],
      },
      // ----- Step 7 -----
      {
        id: "07-rspec",
        title: "ステップ 7: Request Spec で受け入れテスト",
        goal:
          "主要 7 アクションを Request Spec でカバーし、緑/赤の両ケースを書く。",
        instructions:
          "Controller Spec ではなく Request Spec を選ぶ理由は、Rails 公式が推奨しているため + 実際のリクエストに近い形でテストできるため。最低限『正常系 + 入力不正系 + 認可 (今回は未実装) のメモ』を押さえる。",
        files: [
          {
            path: "spec/requests/todos_spec.rb",
            purpose: "Request spec",
          },
        ],
        sampleCode: [
          {
            label: "Request spec",
            language: "ruby",
            filename: "spec/requests/todos_spec.rb",
            code: `require "rails_helper"

RSpec.describe "Todos", type: :request do
  describe "GET /todos" do
    before { create_list(:todo, 3) }
    it "200 を返し件数分表示する" do
      get todos_path
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("ToDo (3)")
    end
  end

  describe "POST /todos" do
    context "正常系" do
      it "Todo を作成し詳細にリダイレクトする" do
        expect {
          post todos_path, params: { todo: { title: "買い物" } }
        }.to change(Todo, :count).by(1)
        expect(response).to redirect_to(Todo.last)
      end
    end

    context "title 空" do
      it "422 を返し作成されない" do
        expect {
          post todos_path, params: { todo: { title: "" } }
        }.not_to change(Todo, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /todos/:id" do
    it "削除し一覧へリダイレクトする" do
      todo = create(:todo)
      expect {
        delete todo_path(todo)
      }.to change(Todo, :count).by(-1)
      expect(response).to redirect_to(todos_path)
    end
  end
end`,
          },
        ],
        commandHints: ["bin/rspec spec/requests/todos_spec.rb"],
        checkpoints: [
          "bin/rspec が全部緑",
          "正常系 / 異常系の両方をカバー (少なくとも create で)",
          "destroy が件数を -1 する",
        ],
        reviewPoints: [
          "expect { ... }.to change(...) は副作用テストの基本イディオム",
          "Spec の describe は『対象 (HTTP メソッド + パス)』、context は『状況 (前提条件)』、it は『期待 (アウトカム)』",
        ],
      },
      // ----- Step 8 -----
      {
        id: "08-review",
        title: "ステップ 8: セルフレビュー & 説明訓練",
        goal:
          "実装を見直し、自分の言葉で他者に説明できる形に整える。",
        instructions:
          "コードが動くことと、クライアントやチームに 1 分で説明できることは別物。以下の項目を口頭で説明し、引っかかった箇所をジャーナルに書き出す。\n\n説明例: 『今回の ToDo CRUD では、まず DB レベルで title を NOT NULL に縛り (1), アプリ層で presence/length バリデーションをかけ (2), Strong Parameters で許可キーを限定 (3) — の三重の入力ガードを敷きました。これにより…』のように、決定理由をセットで言えるかが鍵。",
        checkpoints: [
          "なぜ scaffold を使わず手書きしたのか説明できる",
          "RESTful 7 アクションをホワイトボード無しで列挙できる",
          "Strong Parameters の役割を非エンジニアに 30 秒で説明できる",
          "404 / 422 / 303 が出る場面をそれぞれ言える",
          "テストの green / red サイクルでどれを書き直したか思い出せる",
        ],
        reviewPoints: [
          "CodeDojo の構造化言語訓練ループ: 実装 → 口頭説明 → ジャーナル化 → クイズで定着",
          "詰まった概念は関連カテゴリのクイズで補強する",
        ],
      },
    ],
    reviewChecklist: [
      "title が DB レベルで NOT NULL + アプリ層でバリデーション両掛け",
      "Strong Parameters で permit 列が明示されている",
      "before_action で @todo セットが集約されている",
      "destroy 後のレスポンスが 303 See Other (Turbo 配慮)",
      "保存失敗時に 422 が返り、フォームが再描画される",
      "Request Spec が正常系 + 異常系を含む",
      "scope (recent 等) でクエリの再利用ができている",
      "view 側に複雑な分岐を書きすぎていない",
    ],
    stretch: [
      "ページネーション (kaminari) を導入",
      "ユーザー認証 (Devise) を入れ、has_many :todos に",
      "status 絞り込みリンクの UI 化",
      "due_on が過去なら一覧で警告色に",
      "JSON API バージョン (/api/v1/todos) を別コントローラで",
      "N+1 計測 (bullet gem) と、includes での解消",
      "Soft delete (discard gem) に切り替え",
    ],
    references: [
      {
        label: "Rails Guides: Getting Started",
        url: "https://guides.rubyonrails.org/getting_started.html",
      },
      {
        label: "Rails Guides: Active Record Validations",
        url: "https://guides.rubyonrails.org/active_record_validations.html",
      },
      {
        label: "Rails Guides: Action Controller Overview",
        url: "https://guides.rubyonrails.org/action_controller_overview.html",
      },
      {
        label: "RSpec Rails",
        url: "https://github.com/rspec/rspec-rails",
      },
    ],
  },
];

export const findCrudChallenge = (id: string) =>
  crudChallenges.find((c) => c.id === id);

export const crudChallengesByTrack = (trackId: TrackId) =>
  crudChallenges.filter((c) => c.trackId === trackId);
