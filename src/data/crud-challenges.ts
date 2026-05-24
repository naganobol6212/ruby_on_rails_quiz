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

  // ---------- 2. 認証付きブログ (Devise + Pundit) ----------
  {
    id: "rails-auth-blog",
    trackId: "ruby",
    title: "認証付きブログ — Devise + 認可と所有者制御",
    subtitle:
      "Devise でログイン機能、Pundit で『所有者だけ編集できる』認可、コメント機能、下書き/公開状態。実務でほぼ必ず踏むセキュリティの壁を一周。",
    scenario:
      "ブログサービスの最小機能を実装する。ユーザー登録 / ログイン (Devise)、記事の CRUD、記事は所有者だけ編集削除可 (Pundit)、ログインユーザーはコメント可能、下書き / 公開状態の切替。『認証 (誰?) と認可 (権限?) は別物』を体得することがゴール。",
    audience:
      "Rails ToDo CRUD を一周した / Devise を入れたことはあるが認可の設計まで意識したことはない人",
    estimateMinutes: 120,
    difficulty: "intermediate",
    emoji: "🔐",
    stack: ["Ruby 3.2+", "Rails 7.1+", "PostgreSQL", "Devise", "Pundit", "RSpec"],
    relatedCategoryIds: [
      "rails-convention",
      "routing-controller",
      "active-record",
    ],
    dataModels: [
      {
        name: "User",
        description: "Devise が生成する基本 User。記事とコメントの作成者になる。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "email", type: "string", notes: "UNIQUE, NOT NULL" },
          { name: "encrypted_password", type: "string", notes: "Devise 管理" },
          { name: "name", type: "string", notes: "表示名 (任意拡張)" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "Post",
        description: "ブログ記事。User が所有。下書き/公開状態を持つ。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "user_id", type: "bigint", notes: "FK NOT NULL" },
          { name: "title", type: "string", notes: "NOT NULL, 1..120 文字" },
          { name: "body", type: "text", notes: "NOT NULL" },
          {
            name: "status",
            type: "integer (enum)",
            notes: "0:draft / 1:published。デフォルト 0",
          },
          {
            name: "published_at",
            type: "datetime",
            notes: "公開した時刻 (公開時のみセット)",
          },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "Comment",
        description: "記事へのコメント。ログインユーザーだけ作成可。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "post_id", type: "bigint", notes: "FK NOT NULL" },
          { name: "user_id", type: "bigint", notes: "FK NOT NULL" },
          { name: "body", type: "text", notes: "NOT NULL, 1..500 文字" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/posts",
        description: "公開済み記事の一覧 (全員アクセス可)",
      },
      {
        method: "GET",
        path: "/posts/:id",
        description: "詳細。下書きは所有者のみ閲覧可",
      },
      {
        method: "POST",
        path: "/posts",
        description: "新規作成 (ログイン必須)",
      },
      {
        method: "PATCH",
        path: "/posts/:id",
        description: "更新 (所有者のみ)",
      },
      {
        method: "DELETE",
        path: "/posts/:id",
        description: "削除 (所有者のみ)",
      },
      {
        method: "POST",
        path: "/posts/:post_id/comments",
        description: "コメント投稿 (ログイン必須)",
      },
    ],
    steps: [
      {
        id: "01-bootstrap",
        title: "ステップ 1: アプリ雛形 + Devise インストール",
        goal: "Rails アプリを起動し、Devise で User モデルを生成、ログイン画面が出るところまで。",
        instructions:
          "Devise は『認証で迷ったらまず入れる』定番 gem。`rails g devise:install` の出力に書かれている『4 つの設定』(default url, root, flash, view 生成) を必ず順番に実行する。これを飛ばすとリダイレクト・通知メールが正しく動かない。",
        commandHints: [
          "rails new blog_app -d postgresql -T",
          "cd blog_app",
          "bundle add devise pundit rspec-rails factory_bot_rails",
          "bin/rails db:create",
          "bin/rails g devise:install",
          "bin/rails g devise User",
          "bin/rails g migration AddNameToUsers name:string",
          "bin/rails db:migrate",
        ],
        files: [
          { path: "config/initializers/devise.rb", purpose: "Devise 設定" },
          { path: "config/routes.rb", purpose: "devise_for :users 追加" },
          { path: "app/models/user.rb", purpose: "Devise モジュール" },
        ],
        sampleCode: [
          {
            label: "config/environments/development.rb (default_url_options)",
            language: "ruby",
            code: `config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }`,
          },
          {
            label: "app/views/layouts/application.html.erb (flash 表示)",
            language: "erb",
            code: `<p class="notice"><%= notice %></p>\n<p class="alert"><%= alert %></p>`,
          },
        ],
        checkpoints: [
          "bin/rails s で /users/sign_up にアクセスでき、フォームが表示される",
          "ユーザー登録できる (sign_up → root にリダイレクト)",
          "users テーブルに email, encrypted_password, name カラムがある",
          "flash の notice / alert が画面に表示される",
        ],
        reviewPoints: [
          "Devise の生成物 (Migration / Routes / Model / Views) を理解",
          "default_url_options を環境ごとに正しく設定 (本番では本物のドメインに)",
        ],
      },
      {
        id: "02-models",
        title: "ステップ 2: Post / Comment モデル + 関連",
        goal: "Post と Comment を Devise User に紐付け、下書き/公開の enum、必要な index と外部キーを設定。",
        instructions:
          "User has_many :posts, dependent: :destroy で『退会したら記事も消える』設計。enum で status を扱うと、`post.published?` `post.published!` のような便利メソッドが手に入る。published_at は『公開時のみセット』する設計で、後で『最近公開された記事』のクエリが書きやすい。",
        commandHints: [
          "bin/rails g model Post user:references title:string body:text status:integer published_at:datetime",
          "bin/rails g model Comment post:references user:references body:text",
          "bin/rails db:migrate",
        ],
        sampleCode: [
          {
            label: "Post モデル",
            language: "ruby",
            filename: "app/models/post.rb",
            code: `class Post < ApplicationRecord\n  belongs_to :user\n  has_many :comments, dependent: :destroy\n\n  enum status: { draft: 0, published: 1 }\n\n  validates :title, presence: true, length: { in: 1..120 }\n  validates :body,  presence: true\n\n  scope :recent_first, -> { order(published_at: :desc, created_at: :desc) }\n\n  def publish!\n    update!(status: :published, published_at: Time.current)\n  end\nend`,
          },
          {
            label: "Comment モデル",
            language: "ruby",
            filename: "app/models/comment.rb",
            code: `class Comment < ApplicationRecord\n  belongs_to :post\n  belongs_to :user\n  validates :body, presence: true, length: { in: 1..500 }\nend`,
          },
          {
            label: "User モデル拡張",
            language: "ruby",
            filename: "app/models/user.rb",
            code: `class User < ApplicationRecord\n  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable\n\n  has_many :posts,    dependent: :destroy\n  has_many :comments, dependent: :destroy\n\n  validates :name, presence: true, length: { maximum: 50 }\nend`,
          },
        ],
        checkpoints: [
          "Post / Comment のマイグレーションが通る",
          "user_id / post_id に外部キー制約 + index が貼られている",
          "rails console で `User.first.posts.create!(title: 'x', body: 'y')` が成功する",
          "post.publish! で status: :published と published_at が同時にセットされる",
        ],
        reviewPoints: [
          "dependent: :destroy の選択 (退会時の posts / comments の扱い)",
          "enum で status を扱うメリット (便利メソッド + DB は integer で軽量)",
        ],
      },
      {
        id: "03-routes-and-controller",
        title: "ステップ 3: Routes + PostsController + 認証ガード",
        goal: "RESTful な posts ルートを定義し、コントローラで CRUD を実装。create / edit / update / destroy はログイン必須にする。",
        instructions:
          "Devise の `authenticate_user!` を before_action で呼ぶと『未ログインなら /users/sign_in へ自動リダイレクト』してくれる。`only:` で対象アクションを絞り、index / show は誰でも見れるようにする (下書きの表示制御は次のステップで)。",
        commandHints: [
          "bin/rails g controller Posts index show new create edit update destroy",
        ],
        sampleCode: [
          {
            label: "config/routes.rb",
            language: "ruby",
            code: `Rails.application.routes.draw do\n  devise_for :users\n  resources :posts do\n    resources :comments, only: [:create, :destroy]\n  end\n  root 'posts#index'\nend`,
          },
          {
            label: "PostsController",
            language: "ruby",
            filename: "app/controllers/posts_controller.rb",
            code: `class PostsController < ApplicationController\n  before_action :authenticate_user!, except: %i[index show]\n  before_action :set_post, only: %i[show edit update destroy]\n\n  def index\n    @posts = Post.published.recent_first.includes(:user)\n  end\n\n  def show; end\n\n  def new\n    @post = current_user.posts.build\n  end\n\n  def create\n    @post = current_user.posts.build(post_params)\n    if @post.save\n      redirect_to @post, notice: '記事を保存しました'\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  def edit; end\n\n  def update\n    if @post.update(post_params)\n      redirect_to @post, notice: '更新しました'\n    else\n      render :edit, status: :unprocessable_entity\n    end\n  end\n\n  def destroy\n    @post.destroy\n    redirect_to posts_path, notice: '削除しました', status: :see_other\n  end\n\n  private\n\n  def set_post\n    @post = Post.find(params[:id])\n  end\n\n  def post_params\n    params.require(:post).permit(:title, :body, :status)\n  end\nend`,
          },
        ],
        checkpoints: [
          "ログアウト状態で /posts/new にアクセスすると /users/sign_in へリダイレクト",
          "ログイン後は new / edit / create / update / destroy が動く",
          "current_user.posts.build で作成すると user_id が自動セットされる",
          "/posts のトップで公開記事のみが新着順に並ぶ",
        ],
        reviewPoints: [
          "authenticate_user! の except / only の使い分け",
          "current_user.posts.build パターン (user_id を明示的に渡さない安全な書き方)",
        ],
      },
      {
        id: "04-authorization-pundit",
        title: "ステップ 4: 認可 (Pundit) — 所有者だけが編集可能",
        goal: "Pundit で『他人の記事は編集・削除できない』を実装。403 を返す仕組みも整える。",
        instructions:
          "**認証 (authentication) = 誰?** と **認可 (authorization) = 何ができる?** は別概念。Pundit は『PORO の Policy クラスでルールを書く』シンプルな gem。`authorize @post` を呼ぶと自動で `PostPolicy#update?` などを評価し、false なら Pundit::NotAuthorizedError を投げる。\n\nApplicationController で rescue_from して 403 + flash[:alert] を返すと UX が整う。",
        commandHints: [
          "bin/rails g pundit:install",
          "bin/rails g pundit:policy Post",
        ],
        sampleCode: [
          {
            label: "PostPolicy",
            language: "ruby",
            filename: "app/policies/post_policy.rb",
            code: `class PostPolicy < ApplicationPolicy\n  def show?\n    record.published? || owner?\n  end\n\n  def create?\n    user.present?\n  end\n\n  def update?\n    owner?\n  end\n\n  def destroy?\n    owner?\n  end\n\n  private\n\n  def owner?\n    user.present? && record.user_id == user.id\n  end\n\n  class Scope < Scope\n    def resolve\n      if user\n        # 自分の下書きも見たい\n        scope.where(status: :published).or(scope.where(user_id: user.id))\n      else\n        scope.published\n      end\n    end\n  end\nend`,
          },
          {
            label: "ApplicationController",
            language: "ruby",
            filename: "app/controllers/application_controller.rb",
            code: `class ApplicationController < ActionController::Base\n  include Pundit::Authorization\n\n  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized\n\n  private\n\n  def user_not_authorized\n    flash[:alert] = '権限がありません'\n    redirect_to(request.referer || root_path)\n  end\nend`,
          },
          {
            label: "PostsController に authorize を追加",
            language: "ruby",
            code: `def show\n  authorize @post   # show? を評価\nend\n\ndef edit\n  authorize @post   # update? を評価\nend\n\ndef update\n  authorize @post\n  # ... 既存の update 処理\nend\n\ndef destroy\n  authorize @post\n  # ... 既存の destroy 処理\nend`,
          },
        ],
        checkpoints: [
          "ユーザ A の記事をユーザ B が編集しようとすると flash[:alert] + redirect",
          "下書き記事を所有者以外が show すると不可 (404 / redirect)",
          "ログアウト状態で create フォームに行くと sign_in にリダイレクト",
          "spec/policies/post_policy_spec.rb で各メソッドの true/false を確認",
        ],
        reviewPoints: [
          "認証と認可の境界 (Devise = 誰、Pundit = 何できる)",
          "Policy::Scope で『一覧クエリ』も認可制御 (他人の下書きは見せない)",
        ],
      },
      {
        id: "05-comments",
        title: "ステップ 5: コメント機能 (ネストリソース)",
        goal: "/posts/:post_id/comments で コメント投稿・削除 を実装。ログイン必須。コメントは作成者のみ削除可。",
        instructions:
          "ネストルートで親 (post) との関連を URL に反映する。`current_user.comments.build(post: @post, body: ...)` で user_id / post_id を自動セット。コメント削除も Pundit で本人チェック。",
        sampleCode: [
          {
            label: "CommentsController",
            language: "ruby",
            filename: "app/controllers/comments_controller.rb",
            code: `class CommentsController < ApplicationController\n  before_action :authenticate_user!\n  before_action :set_post\n\n  def create\n    @comment = @post.comments.build(comment_params.merge(user: current_user))\n    if @comment.save\n      redirect_to @post, notice: 'コメントしました'\n    else\n      redirect_to @post, alert: @comment.errors.full_messages.join(', ')\n    end\n  end\n\n  def destroy\n    @comment = @post.comments.find(params[:id])\n    authorize @comment   # CommentPolicy で本人チェック\n    @comment.destroy\n    redirect_to @post, notice: '削除しました', status: :see_other\n  end\n\n  private\n\n  def set_post\n    @post = Post.find(params[:post_id])\n  end\n\n  def comment_params\n    params.require(:comment).permit(:body)\n  end\nend`,
          },
          {
            label: "CommentPolicy",
            language: "ruby",
            filename: "app/policies/comment_policy.rb",
            code: `class CommentPolicy < ApplicationPolicy\n  def destroy?\n    user.present? && record.user_id == user.id\n  end\nend`,
          },
        ],
        checkpoints: [
          "ログインユーザがコメント投稿できる",
          "未ログインユーザはコメントフォーム自体が出ない (or sign_in に飛ぶ)",
          "他人のコメントは削除できない",
          "Post#show で comments 一覧 + フォームが表示される",
        ],
        reviewPoints: [
          "ネストリソースの parent_id 自動セット (current_user.comments.build vs @post.comments.build)",
          "Pundit policy をリソースごとに分離 (Post / Comment)",
        ],
      },
      {
        id: "06-spec-and-polish",
        title: "ステップ 6: テストと仕上げ",
        goal: "Request spec で 認証 / 認可 のシナリオを担保。Devise のテストヘルパーを使い、未ログイン・他人・所有者の 3 視点をカバーする。",
        instructions:
          "認証付きアプリのテストは『誰として実行するか』が要。spec_helper で Devise::Test::IntegrationHelpers を include し、`sign_in user` で疑似ログイン。各シナリオで『未ログイン』『他人』『所有者』の 3 視点を必ずカバーすると認可漏れが検出できる。",
        commandHints: [
          "bin/rspec spec/requests/posts_spec.rb",
        ],
        sampleCode: [
          {
            label: "spec/rails_helper.rb (Devise ヘルパー)",
            language: "ruby",
            code: `RSpec.configure do |config|\n  config.include Devise::Test::IntegrationHelpers, type: :request\nend`,
          },
          {
            label: "spec/requests/posts_spec.rb",
            language: "ruby",
            code: `require 'rails_helper'\n\nRSpec.describe 'Posts', type: :request do\n  let(:author)   { User.create!(email: 'a@x.com', password: 'password', name: 'A') }\n  let(:stranger) { User.create!(email: 'b@x.com', password: 'password', name: 'B') }\n  let!(:post)    { author.posts.create!(title: 't', body: 'b', status: :published) }\n\n  describe 'GET /posts/:id/edit' do\n    it '未ログインは sign_in に飛ぶ' do\n      get edit_post_path(post)\n      expect(response).to redirect_to(new_user_session_path)\n    end\n\n    it '他人は権限なし' do\n      sign_in stranger\n      get edit_post_path(post)\n      expect(response).to redirect_to(root_path)\n      follow_redirect!\n      expect(response.body).to include('権限がありません')\n    end\n\n    it '所有者は OK' do\n      sign_in author\n      get edit_post_path(post)\n      expect(response).to have_http_status(:ok)\n    end\n  end\nend`,
          },
        ],
        checkpoints: [
          "3 視点 (未ログイン / 他人 / 所有者) を網羅した request spec が pass",
          "Policy spec で `permit_authorization` を確認",
          "CSRF / Strong Parameters / 422 ステータスがすべて整っている",
          "destroy 後は 303 See Other で redirect (Turbo 互換)",
        ],
        reviewPoints: [
          "認可テストは『未ログイン / 他人 / 所有者』の 3 視点をテンプレ化する",
          "Devise の sign_in / sign_out ヘルパーを使ってシナリオを簡潔に",
        ],
      },
    ],
    reviewChecklist: [
      "認証 (Devise) と認可 (Pundit) を明確に分離している",
      "他人の記事を編集・削除できないことを request spec で検証",
      "下書き記事は所有者以外見えない (show 制御 + Scope 両方)",
      "コメントは作成者のみ削除可能",
      "未ログイン時の各画面で sign_in にリダイレクト",
      "DB 制約 (FK + NOT NULL) と Model バリデーションを両方設定",
    ],
    stretch: [
      "ロール (admin) を追加して全権限を持つユーザを実装",
      "Markdown レンダリング (redcarpet 等) で記事本文を装飾",
      "「下書き保存 → 後で公開」フローを WIP 状態で残す",
      "コメントの編集機能 + Pundit policy",
      "Sidekiq でコメント通知メールを非同期送信",
      "Hotwire (Turbo Streams) でコメントをリアルタイム追加",
    ],
    references: [
      {
        label: "Devise (公式 GitHub)",
        url: "https://github.com/heartcombo/devise",
      },
      {
        label: "Pundit (公式 GitHub)",
        url: "https://github.com/varvet/pundit",
      },
      {
        label: "Rails Guides: Action Controller — Filters",
        url: "https://guides.rubyonrails.org/action_controller_overview.html#filters",
      },
    ],
  },

  // ---------- 3. ファイルアップロード (Active Storage) ----------
  {
    id: "rails-photo-gallery",
    trackId: "ruby",
    title: "フォトギャラリー — Active Storage で画像アップロード",
    subtitle:
      "Active Storage で画像をアップロード、image_processing で variant (サムネ/プレビュー)、has_many_attached で複数添付、バリデーション。本番では S3 へ。",
    scenario:
      "ユーザーが写真を投稿してギャラリー表示するアプリ。Active Storage で 1 投稿に複数画像を添付、image_processing でサムネと拡大表示を分けて生成、ファイルサイズ・MIME・拡張子のバリデーション、本番では Amazon S3 にアップロードする構成までを一周。",
    audience:
      "Active Storage を入れたことはあるが variant や複数添付、サイズバリデーションまでやったことがない人",
    estimateMinutes: 100,
    difficulty: "intermediate",
    emoji: "🖼️",
    stack: [
      "Ruby 3.2+",
      "Rails 7.1+",
      "PostgreSQL",
      "Active Storage",
      "image_processing (libvips)",
      "RSpec",
    ],
    relatedCategoryIds: ["rails-convention", "active-record", "routing-controller"],
    dataModels: [
      {
        name: "Photo",
        description: "1 投稿。タイトルと複数の画像を持つ。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "title", type: "string", notes: "NOT NULL, 1..100 文字" },
          { name: "description", type: "text", notes: "任意" },
          { name: "user_id", type: "bigint", notes: "FK (任意拡張)" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "ActiveStorage::Attachment / Blob",
        description:
          "Active Storage 標準テーブル。`has_many_attached :images` で自動的に紐付く。",
        columns: [
          { name: "active_storage_blobs.key", type: "string", notes: "ストレージ上の一意 ID" },
          { name: "active_storage_blobs.filename", type: "string" },
          { name: "active_storage_blobs.content_type", type: "string" },
          { name: "active_storage_blobs.byte_size", type: "bigint" },
        ],
      },
    ],
    apiEndpoints: [
      { method: "GET", path: "/photos", description: "ギャラリー一覧 (サムネ)" },
      { method: "GET", path: "/photos/:id", description: "詳細 (拡大表示)" },
      { method: "GET", path: "/photos/new", description: "新規投稿フォーム" },
      {
        method: "POST",
        path: "/photos",
        description: "新規作成 (multipart/form-data で複数画像)",
      },
      { method: "PATCH", path: "/photos/:id", description: "更新 + 画像追加" },
      { method: "DELETE", path: "/photos/:id", description: "削除 (画像も削除)" },
    ],
    steps: [
      {
        id: "01-install",
        title: "ステップ 1: Active Storage インストール + libvips",
        goal: "Active Storage と image_processing を有効化し、開発環境で画像変換できる状態にする。",
        instructions:
          "Active Storage はマイグレーションで `active_storage_blobs / attachments / variant_records` の 3 テーブルを作る。`image_processing` は libvips または ImageMagick を背後で使う。最近は **libvips が速くてメモリ効率が良い** ので推奨。\n\n```bash\n# macOS\nbrew install vips\n# Ubuntu\nsudo apt install libvips\n```",
        commandHints: [
          "rails new photo_gallery -d postgresql -T",
          "cd photo_gallery",
          "bundle add image_processing",
          "bin/rails active_storage:install",
          "bin/rails db:create db:migrate",
        ],
        files: [
          {
            path: "config/storage.yml",
            purpose: "ストレージ先 (local / s3 / gcs)",
          },
          {
            path: "config/environments/development.rb",
            purpose: "config.active_storage.service = :local",
          },
        ],
        sampleCode: [
          {
            label: "config/storage.yml (デフォルト)",
            language: "yaml",
            code: `test:\n  service: Disk\n  root: <%= Rails.root.join("tmp/storage") %>\n\nlocal:\n  service: Disk\n  root: <%= Rails.root.join("storage") %>\n\n# 本番用 (S3 例、Step 6 で説明)\namazon:\n  service: S3\n  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>\n  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>\n  region: ap-northeast-1\n  bucket: my-photos-bucket`,
          },
        ],
        checkpoints: [
          "active_storage:install のマイグレーションが通る",
          "active_storage_blobs / attachments / variant_records テーブルが存在",
          "vips コマンドが PATH に通っている (`vips --version`)",
          "image_processing gem が Gemfile.lock に含まれる",
        ],
        reviewPoints: [
          "libvips と ImageMagick の違い (libvips の方が高速 / 省メモリ)",
          "blob / attachment / variant_records の役割分担",
        ],
      },
      {
        id: "02-model",
        title: "ステップ 2: Photo モデル + has_many_attached",
        goal: "Photo モデルに has_many_attached :images を宣言し、ファイルサイズ・MIME のバリデーションを追加。",
        instructions:
          "**Active Storage はファイル本体を別テーブル (Blob) で管理** するので、Photo テーブル自体には画像カラム不要。`has_one_attached` / `has_many_attached` は『Photo と Blob を繋ぐ Attachment レコード』を内部で管理する Macro。\n\nバリデーションは標準では弱いので **手動で書く** か `active_storage_validations` gem を使うと簡潔。",
        commandHints: [
          "bin/rails g model Photo title:string description:text",
          "bin/rails db:migrate",
        ],
        sampleCode: [
          {
            label: "Photo モデル",
            language: "ruby",
            filename: "app/models/photo.rb",
            code: `class Photo < ApplicationRecord\n  has_many_attached :images\n\n  validates :title, presence: true, length: { in: 1..100 }\n  validate  :images_presence\n  validate  :images_size_and_type\n\n  MAX_BYTES        = 5.megabytes\n  ALLOWED_TYPES    = %w[image/jpeg image/png image/webp].freeze\n\n  private\n\n  def images_presence\n    errors.add(:images, 'は 1 枚以上必要です') if images.blank?\n  end\n\n  def images_size_and_type\n    images.each do |img|\n      if img.byte_size > MAX_BYTES\n        errors.add(:images, "#{img.filename} は 5MB を超えています")\n      end\n      unless ALLOWED_TYPES.include?(img.content_type)\n        errors.add(:images, "#{img.filename} は JPEG/PNG/WebP のみ受け付けます")\n      end\n    end\n  end\nend`,
          },
        ],
        checkpoints: [
          "Photo.new に images を添付して valid? が true",
          "サイズ 0 で valid? が false",
          "MIME 不正 (image/gif など) で valid? が false",
          "ファイルサイズ 6MB の画像で valid? が false",
        ],
        reviewPoints: [
          "has_many_attached の裏側 (Attachment + Blob の関係)",
          "クライアント側で MIME を偽装できるのでサーバ側バリデーション必須",
        ],
      },
      {
        id: "03-form-and-upload",
        title: "ステップ 3: 投稿フォーム + アップロード",
        goal: "multipart/form-data の投稿フォームを作り、複数画像を一度にアップロード。",
        instructions:
          "**form_with の multipart は自動判定** ですが、ファイル input がある場合は明示的に `multipart: true` を書いても OK。Strong Parameters は `images: []` で複数画像を受け取る。",
        commandHints: [
          "bin/rails g controller Photos index show new create edit update destroy",
        ],
        sampleCode: [
          {
            label: "PhotosController",
            language: "ruby",
            filename: "app/controllers/photos_controller.rb",
            code: `class PhotosController < ApplicationController\n  before_action :set_photo, only: %i[show edit update destroy]\n\n  def index\n    @photos = Photo.includes(images_attachments: :blob).order(created_at: :desc)\n  end\n\n  def show; end\n\n  def new\n    @photo = Photo.new\n  end\n\n  def create\n    @photo = Photo.new(photo_params)\n    if @photo.save\n      redirect_to @photo, notice: '投稿しました'\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  def edit; end\n\n  def update\n    if @photo.update(photo_params)\n      redirect_to @photo, notice: '更新しました'\n    else\n      render :edit, status: :unprocessable_entity\n    end\n  end\n\n  def destroy\n    @photo.destroy\n    redirect_to photos_path, notice: '削除しました', status: :see_other\n  end\n\n  private\n\n  def set_photo\n    @photo = Photo.find(params[:id])\n  end\n\n  def photo_params\n    params.require(:photo).permit(:title, :description, images: [])\n  end\nend`,
          },
          {
            label: "app/views/photos/_form.html.erb",
            language: "erb",
            code: `<%= form_with(model: @photo, local: true) do |f| %>\n  <% if @photo.errors.any? %>\n    <ul class=\"errors\">\n      <% @photo.errors.full_messages.each do |msg| %>\n        <li><%= msg %></li>\n      <% end %>\n    </ul>\n  <% end %>\n\n  <%= f.label :title %>\n  <%= f.text_field :title %>\n\n  <%= f.label :description %>\n  <%= f.text_area :description %>\n\n  <%= f.label :images, '画像 (複数可)' %>\n  <%= f.file_field :images, multiple: true, accept: 'image/jpeg,image/png,image/webp' %>\n\n  <%= f.submit %>\n<% end %>`,
          },
        ],
        checkpoints: [
          "/photos/new フォームで複数画像を選択してアップロードできる",
          "画像 0 枚や 6MB 超のファイルは valid? が false でフォームに戻る",
          "storage/ ディレクトリにファイルが保存される (Disk service の場合)",
          "Photo.last.images.count で添付数を確認できる",
        ],
        reviewPoints: [
          "Strong Parameters の `images: []` (配列パーミット) の意味",
          "クライアントの accept 属性は UX 向上だが信頼してはいけない (サーバ側で検証)",
        ],
      },
      {
        id: "04-variants",
        title: "ステップ 4: variant でサムネと拡大版を作る",
        goal: "ギャラリー (200x200 サムネ) と詳細ページ (800x800) で variant を使い分け、image_tag で表示。",
        instructions:
          "**variant は『リクエスト時に生成 → キャッシュ』** される。最初のアクセスは少し時間がかかるが、2 回目以降は変換済みファイルが S3 や Disk から返る。`representation` を使うと PDF などの非画像も統一的にサムネ生成できる。\n\nN+1 対策に `includes(images_attachments: :blob)` を忘れずに。",
        sampleCode: [
          {
            label: "Photo モデル: variant 定義 (任意)",
            language: "ruby",
            filename: "app/models/photo.rb",
            code: `# 既存の Photo クラスに追加\n  def thumbnail_for(image)\n    image.variant(resize_to_fill: [200, 200], format: :webp).processed\n  end\n\n  def preview_for(image)\n    image.variant(resize_to_limit: [800, 800], format: :webp).processed\n  end`,
          },
          {
            label: "ギャラリー表示 (index)",
            language: "erb",
            filename: "app/views/photos/index.html.erb",
            code: `<div class=\"gallery\">\n  <% @photos.each do |photo| %>\n    <article>\n      <%= link_to photo do %>\n        <% if photo.images.attached? %>\n          <%= image_tag photo.thumbnail_for(photo.images.first), alt: photo.title %>\n        <% end %>\n      <% end %>\n      <h3><%= photo.title %></h3>\n    </article>\n  <% end %>\n</div>`,
          },
          {
            label: "詳細表示 (show)",
            language: "erb",
            filename: "app/views/photos/show.html.erb",
            code: `<h1><%= @photo.title %></h1>\n<p><%= simple_format(@photo.description) %></p>\n\n<div class=\"preview\">\n  <% @photo.images.each do |image| %>\n    <%= image_tag @photo.preview_for(image), alt: @photo.title %>\n  <% end %>\n</div>`,
          },
        ],
        checkpoints: [
          "ギャラリーで 200x200 にリサイズされたサムネが表示される",
          "詳細ページで 800x800 までフィットした画像が表示される",
          "2 回目以降は同じ variant が高速で返る (キャッシュ確認)",
          "format: :webp で WebP に変換される (元が JPEG/PNG でも)",
        ],
        reviewPoints: [
          "resize_to_fill (切り抜き) と resize_to_limit (アスペクト比保持) の違い",
          "WebP 変換による帯域削減効果",
        ],
      },
      {
        id: "05-attach-remove",
        title: "ステップ 5: 画像の追加・差し替え・削除",
        goal: "編集時に画像を追加・差し替え、特定の画像だけ削除する機能を実装。",
        instructions:
          "`has_many_attached :images` で update に images: [...] を渡すと **既存に追加** される (置き換えではない)。**置き換えたい場合は `purge` してから attach** する。\n\n特定画像だけ削除するには `attachment.purge` または非同期版 `purge_later` を使う。",
        sampleCode: [
          {
            label: "個別画像の削除エンドポイント (任意)",
            language: "ruby",
            code: `# config/routes.rb\nresources :photos do\n  resources :images, only: [:destroy], controller: 'photo_images'\nend\n\n# app/controllers/photo_images_controller.rb\nclass PhotoImagesController < ApplicationController\n  def destroy\n    photo = Photo.find(params[:photo_id])\n    image = photo.images.find(params[:id])\n    image.purge_later\n    redirect_to edit_photo_path(photo), notice: '画像を削除しました', status: :see_other\n  end\nend`,
          },
          {
            label: "編集フォームで画像一覧 + 削除リンク",
            language: "erb",
            code: `<% @photo.images.each do |image| %>\n  <div class=\"existing-image\">\n    <%= image_tag image.variant(resize_to_limit: [200, 200]) %>\n    <%= button_to '削除', photo_image_path(@photo, image), method: :delete, data: { turbo_confirm: '削除しますか?' } %>\n  </div>\n<% end %>`,
          },
          {
            label: "purge vs purge_later",
            language: "ruby",
            code: `# 同期削除 (リクエスト中に削除完了、レスポンス遅延あり)\nimage.purge\n\n# 非同期削除 (ActiveJob で削除、レスポンス即座)\nimage.purge_later`,
          },
        ],
        checkpoints: [
          "編集画面で画像を追加すると既存に追加される (置き換えではない)",
          "個別の画像を削除できる",
          "purge_later で本体 (Disk / S3) からもファイルが削除される",
          "Photo を destroy すると関連 attachment + blob も削除される",
        ],
        reviewPoints: [
          "purge と purge_later の使い分け (UX 重視なら later、確実性なら 同期)",
          "Photo destroy で Active Storage の dependent: :purge_later がデフォルトで動く",
        ],
      },
      {
        id: "06-production-s3",
        title: "ステップ 6: 本番ストレージ (S3) への切替",
        goal: "config/storage.yml で S3 設定、Credentials に AWS Key を保存、production.rb で service を amazon に。",
        instructions:
          "本番では Disk service は使わない (サーバ再起動でファイルが消えるリスク、複数サーバで共有不可)。**S3 / GCS / Azure Blob** などのオブジェクトストレージに切り替える。\n\nAWS Credentials は **Rails Encrypted Credentials** に入れて Git に含めても安全に管理。CDN を前段に置いて配信を高速化するパターンも頻出。",
        commandHints: [
          "bundle add aws-sdk-s3",
          "EDITOR=vim bin/rails credentials:edit",
        ],
        sampleCode: [
          {
            label: "config/storage.yml (amazon 設定)",
            language: "yaml",
            code: `amazon:\n  service: S3\n  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>\n  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>\n  region: ap-northeast-1\n  bucket: my-photos-bucket-prod\n  # CDN を使う場合\n  # public: true\n  # cdn_host: https://cdn.example.com`,
          },
          {
            label: "config/environments/production.rb",
            language: "ruby",
            code: `config.active_storage.service = :amazon`,
          },
          {
            label: "Rails Credentials (vim で開いた状態)",
            language: "yaml",
            code: `aws:\n  access_key_id: AKIAIOSFODNN7EXAMPLE\n  secret_access_key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
          },
        ],
        checkpoints: [
          "credentials:edit で AWS キーを暗号化保存できる",
          "RAILS_ENV=production rails console で Photo.last.images.first.url が S3 の URL を返す",
          "S3 バケットの IAM ポリシーで最小権限 (PutObject / GetObject / DeleteObject) を付与",
          "config/master.key が .gitignore されている",
        ],
        reviewPoints: [
          "Encrypted Credentials の運用 (master.key は別途共有、本番は RAILS_MASTER_KEY 環境変数)",
          "CDN を前段に置く設計 (CloudFront / Cloudflare 経由で配信高速化)",
        ],
      },
    ],
    reviewChecklist: [
      "has_many_attached でアップロードが動く",
      "サイズ / MIME のサーバ側バリデーションが効く",
      "variant でサムネと拡大版を出し分けている",
      "N+1 対策 (includes(images_attachments: :blob))",
      "個別画像の追加・削除ができる",
      "本番 S3 + Encrypted Credentials の構成を理解",
    ],
    stretch: [
      "Direct Upload (Active Storage の direct_upload オプション) でブラウザから直接 S3 へ",
      "EXIF 情報の自動抽出 + DB 保存 (画像メタデータ)",
      "画像の自動回転 (向きの自動補正)",
      "サムネ生成を ActiveJob で非同期化 (UX 改善)",
      "rmagick から libvips への移行",
      "シグネチャ付き URL でプライベート画像配信",
    ],
    references: [
      {
        label: "Rails Guides: Active Storage Overview (公式)",
        url: "https://guides.rubyonrails.org/active_storage_overview.html",
      },
      {
        label: "image_processing gem",
        url: "https://github.com/janko/image_processing",
      },
      {
        label: "libvips (公式)",
        url: "https://www.libvips.org/",
      },
    ],
  },

  // ---------- 4. JSON API + RSpec ----------
  {
    id: "rails-api-with-tests",
    trackId: "ruby",
    title: "JSON API + RSpec — API モードで型と認証まで一周",
    subtitle:
      "rails new --api で View 層なしの REST API。Bearer 認証、ページネーション、jbuilder シリアライズ、CORS、Request Spec まで。",
    scenario:
      "モバイルアプリ / SPA のバックエンド API を Rails で実装する。GET /api/v1/posts で公開済み投稿を返し、認証付きで POST /api/v1/posts で新規投稿、エラーレスポンスを統一形式で返す。RSpec の request spec で『認証成功・失敗・バリデーションエラー』のシナリオを全部カバーする。",
    audience:
      "通常の Rails アプリは書けるが、API 専用モードや JSON シリアライザの設計、Bearer 認証の自前実装をやったことがない人",
    estimateMinutes: 120,
    difficulty: "advanced",
    emoji: "🔌",
    stack: [
      "Ruby 3.2+",
      "Rails 7.1+ (API mode)",
      "PostgreSQL",
      "jbuilder",
      "kaminari",
      "rack-cors",
      "RSpec",
    ],
    relatedCategoryIds: ["rails-convention", "routing-controller", "active-record"],
    dataModels: [
      {
        name: "User",
        description: "API ユーザ。API トークンを持つ。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "email", type: "string", notes: "UNIQUE NOT NULL" },
          { name: "name", type: "string", notes: "NOT NULL" },
          { name: "api_token", type: "string", notes: "UNIQUE NOT NULL, has_secure_token" },
        ],
      },
      {
        name: "Post",
        description: "投稿。User が所有。",
        columns: [
          { name: "id", type: "bigint" },
          { name: "user_id", type: "bigint", notes: "FK NOT NULL" },
          { name: "title", type: "string", notes: "NOT NULL" },
          { name: "body", type: "text", notes: "NOT NULL" },
          { name: "published_at", type: "datetime", notes: "公開時刻 (任意)" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/v1/posts",
        description: "公開済み投稿一覧 (page, per で分割)",
        response: "200: [{id, title, body, author, published_at}]",
      },
      {
        method: "GET",
        path: "/api/v1/posts/:id",
        description: "単一投稿",
        response: "200 or 404",
      },
      {
        method: "POST",
        path: "/api/v1/posts",
        description: "新規投稿 (Bearer 認証必須)",
        request: "{post: {title, body}}",
        response: "201 or 422 (validation error) or 401 (unauthenticated)",
      },
      {
        method: "PATCH",
        path: "/api/v1/posts/:id",
        description: "更新 (所有者のみ)",
      },
      {
        method: "DELETE",
        path: "/api/v1/posts/:id",
        description: "削除 (所有者のみ)",
      },
    ],
    steps: [
      {
        id: "01-bootstrap",
        title: "ステップ 1: API モードで rails new",
        goal: "View / Cookie / Asset Pipeline を持たない API 専用 Rails アプリを起動。",
        instructions:
          "**`rails new --api`** で API 専用構成を生成。View / Helper / Cookie / Asset Pipeline などが省かれ、ActionController::Base ではなく **ActionController::API** が親クラスになる。\n\n軽量で起動も速く、API 専用なら最初からこれを選ぶ。",
        commandHints: [
          "rails new posts_api --api -d postgresql -T",
          "cd posts_api",
          "bundle add jbuilder kaminari rack-cors rspec-rails factory_bot_rails",
          "bin/rails g rspec:install",
          "bin/rails db:create",
        ],
        files: [
          {
            path: "app/controllers/application_controller.rb",
            purpose: "ActionController::API を継承していることを確認",
          },
          {
            path: "config/initializers/cors.rb",
            purpose: "CORS 設定 (rack-cors)",
          },
        ],
        sampleCode: [
          {
            label: "config/initializers/cors.rb",
            language: "ruby",
            code: `Rails.application.config.middleware.insert_before 0, Rack::Cors do\n  allow do\n    # 開発中は * 許可、本番は SPA のドメインに絞る\n    origins ENV.fetch('CORS_ORIGIN', '*')\n    resource '*',\n      headers: :any,\n      methods: %i[get post patch put delete options head],\n      expose: %w[X-Total-Count]\n  end\nend`,
          },
        ],
        checkpoints: [
          "bin/rails s でサーバが起動し、トップが 404 (ルート未定義) を返す",
          "ApplicationController が ActionController::API を継承している",
          "CORS が * で有効化されている (本番では絞る)",
          "X-Total-Count が expose されている (後でページネーションで使う)",
        ],
        reviewPoints: [
          "API モードと通常モードの違い (継承元、middleware 構成)",
          "CORS の origins を本番では絞る運用",
        ],
      },
      {
        id: "02-models",
        title: "ステップ 2: User / Post モデル + has_secure_token",
        goal: "Post モデルと User モデルを作り、User#api_token を自動生成する has_secure_token を設定。",
        instructions:
          "**`has_secure_token`** は SecureRandom.base58 ベースの一意なトークンを自動生成する Rails 標準機能。生成時にカラムに保存され、衝突したら自動でリトライする。\n\nMigration では `t.string :api_token` に **UNIQUE INDEX を必ず貼る** こと (高速検索 + 衝突防止)。",
        commandHints: [
          "bin/rails g model User email:string:uniq name:string api_token:string:uniq",
          "bin/rails g model Post user:references title:string body:text published_at:datetime",
          "bin/rails db:migrate",
        ],
        sampleCode: [
          {
            label: "User モデル",
            language: "ruby",
            filename: "app/models/user.rb",
            code: `class User < ApplicationRecord\n  has_secure_token :api_token\n  has_many :posts, dependent: :destroy\n\n  validates :email, presence: true, uniqueness: true,\n            format: { with: URI::MailTo::EMAIL_REGEXP }\n  validates :name,  presence: true, length: { maximum: 50 }\nend`,
          },
          {
            label: "Post モデル",
            language: "ruby",
            filename: "app/models/post.rb",
            code: `class Post < ApplicationRecord\n  belongs_to :user\n\n  validates :title, presence: true, length: { in: 1..120 }\n  validates :body,  presence: true\n\n  scope :published, -> { where.not(published_at: nil) }\n  scope :recent,    -> { order(published_at: :desc, created_at: :desc) }\n\n  def published?\n    published_at.present?\n  end\nend`,
          },
        ],
        checkpoints: [
          "User.create!(email: ..., name: ...) で api_token が自動生成される",
          "users.api_token に UNIQUE INDEX が貼られている",
          "Post.create!(user:, title:, body:) で関連が貼られる",
          "Post.published.recent で公開済み + 新着順を取得できる",
        ],
        reviewPoints: [
          "has_secure_token の仕組み (SecureRandom + 衝突時リトライ)",
          "API トークンを文字列カラムで持つ vs JWT などのトークン (今回はシンプル選択)",
        ],
      },
      {
        id: "03-controllers",
        title: "ステップ 3: Api::V1::PostsController (index/show)",
        goal: "namespace :api do namespace :v1 do resources でルートを切り、jbuilder で JSON を返す。",
        instructions:
          "Rails では `namespace` で URL とクラス階層を同時にスコープできる。jbuilder は **View レイヤで JSON を組み立てる** 標準ツールで、`app/views/api/v1/posts/index.json.jbuilder` のような jbuilder ファイルを置くと自動で render される。\n\n`includes(:user)` で N+1 対策、kaminari で `page / per` でページネーション。",
        sampleCode: [
          {
            label: "config/routes.rb",
            language: "ruby",
            code: `Rails.application.routes.draw do\n  namespace :api do\n    namespace :v1 do\n      resources :posts, only: %i[index show create update destroy]\n    end\n  end\nend`,
          },
          {
            label: "Api::V1::PostsController (index/show)",
            language: "ruby",
            filename: "app/controllers/api/v1/posts_controller.rb",
            code: `module Api\n  module V1\n    class PostsController < ApplicationController\n      def index\n        scope = Post.includes(:user).published.recent\n        @posts = scope.page(params[:page]).per([params[:per].to_i, 100].min.positive? ? params[:per] : 20)\n        response.headers['X-Total-Count'] = scope.count.to_s\n      end\n\n      def show\n        @post = Post.includes(:user).find(params[:id])\n      end\n    end\n  end\nend`,
          },
          {
            label: "app/views/api/v1/posts/index.json.jbuilder",
            language: "ruby",
            code: `json.array! @posts, partial: 'api/v1/posts/post', as: :post`,
          },
          {
            label: "app/views/api/v1/posts/show.json.jbuilder",
            language: "ruby",
            code: `json.partial! 'api/v1/posts/post', post: @post`,
          },
          {
            label: "app/views/api/v1/posts/_post.json.jbuilder",
            language: "ruby",
            code: `json.id           post.id\njson.title        post.title\njson.body         post.body\njson.published_at post.published_at&.iso8601\njson.author do\n  json.id   post.user.id\n  json.name post.user.name\nend`,
          },
        ],
        checkpoints: [
          "GET /api/v1/posts で JSON 配列が返る",
          "X-Total-Count レスポンスヘッダーに件数が入る",
          "?page=2&per=5 で 6-10 件目が返る",
          "GET /api/v1/posts/999999 で 404",
          "N+1 ログ (development.log) が出ない (Bullet gem で検証推奨)",
        ],
        reviewPoints: [
          "jbuilder と to_json の比較 (jbuilder は宣言的、Hash + partial 構造)",
          "namespace で URL とモジュールを同時にスコープする利点",
        ],
      },
      {
        id: "04-authentication",
        title: "ステップ 4: Bearer トークン認証",
        goal: "Authorization: Bearer <token> ヘッダーで User を特定し、認証必須エンドポイントを保護。",
        instructions:
          "**Bearer 認証** は OAuth 2.0 由来の標準形式。`Authorization: Bearer <token>` ヘッダーから token を抽出 → User.find_by(api_token: token) で照合 → 失敗時は 401。\n\n**タイミング攻撃対策** に `ActiveSupport::SecurityUtils.secure_compare` を使うとさらに堅牢。",
        sampleCode: [
          {
            label: "ApplicationController に認証ヘルパー",
            language: "ruby",
            filename: "app/controllers/application_controller.rb",
            code: `class ApplicationController < ActionController::API\n  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found\n  rescue_from ActiveRecord::RecordInvalid,  with: :render_invalid\n  rescue_from ActionController::ParameterMissing, with: :render_bad_request\n\n  private\n\n  def authenticate_api_user!\n    token = bearer_token\n    @current_api_user = User.find_by(api_token: token) if token\n    return if @current_api_user\n\n    render json: { error: 'unauthorized' }, status: :unauthorized\n  end\n\n  def current_api_user\n    @current_api_user\n  end\n\n  def bearer_token\n    auth = request.headers['Authorization']\n    return nil unless auth.present?\n    match = auth.match(/\\\\ABearer\\\\s+(.+)\\\\z/)\n    match && match[1]\n  end\n\n  def render_not_found\n    render json: { error: 'not_found' }, status: :not_found\n  end\n\n  def render_invalid(e)\n    render json: { error: 'validation_error', details: e.record.errors }, status: :unprocessable_entity\n  end\n\n  def render_bad_request(e)\n    render json: { error: 'bad_request', message: e.message }, status: :bad_request\n  end\nend`,
          },
          {
            label: "Api::V1::PostsController (write 系)",
            language: "ruby",
            code: `module Api\n  module V1\n    class PostsController < ApplicationController\n      before_action :authenticate_api_user!, only: %i[create update destroy]\n      before_action :set_post, only: %i[update destroy]\n\n      def create\n        @post = current_api_user.posts.create!(post_params)\n        render :show, status: :created\n      end\n\n      def update\n        return render json: { error: 'forbidden' }, status: :forbidden unless @post.user_id == current_api_user.id\n        @post.update!(post_params)\n        render :show\n      end\n\n      def destroy\n        return render json: { error: 'forbidden' }, status: :forbidden unless @post.user_id == current_api_user.id\n        @post.destroy!\n        head :no_content\n      end\n\n      private\n\n      def set_post\n        @post = Post.find(params[:id])\n      end\n\n      def post_params\n        params.require(:post).permit(:title, :body, :published_at)\n      end\n    end\n  end\nend`,
          },
        ],
        checkpoints: [
          "Authorization ヘッダーなしで POST すると 401 が返る",
          "正しいトークンなら 201 で投稿が作成される",
          "他人の投稿を update / destroy しようとすると 403",
          "Validation エラー (title 空) で 422 が返り {error: 'validation_error', details: {...}}",
        ],
        reviewPoints: [
          "401 (誰?) と 403 (権限?) の使い分け",
          "rescue_from で例外を統一エラーレスポンスに変換するパターン",
        ],
      },
      {
        id: "05-request-spec",
        title: "ステップ 5: Request Spec で全シナリオをカバー",
        goal: "RSpec request spec で『未認証 / 認証成功 / 他人 / バリデーションエラー』の 4 シナリオを全部書く。",
        instructions:
          "API のテストは **request spec** が定番。HTTP リクエストとレスポンスを直接検証できるので、controller spec より実態に近い。\n\n**JSON のスキーマ検証** は `assert_match_response_schema` (rswag) や `match_json_schema` (json-schema) でできるが、最初はシンプルに `expect(json['author']['name']).to eq 'Alice'` のような dot 記法で十分。",
        commandHints: [
          "bin/rspec spec/requests/api/v1/posts_spec.rb",
        ],
        sampleCode: [
          {
            label: "spec/requests/api/v1/posts_spec.rb",
            language: "ruby",
            code: `require 'rails_helper'\n\nRSpec.describe 'Api::V1::Posts', type: :request do\n  let(:user)     { User.create!(email: 'a@x.com', name: 'Alice') }\n  let(:stranger) { User.create!(email: 'b@x.com', name: 'Bob') }\n  let!(:post)    { user.posts.create!(title: 't', body: 'b', published_at: Time.current) }\n\n  let(:auth) { { 'Authorization' => \"Bearer \#{user.api_token}\" } }\n\n  describe 'GET /api/v1/posts' do\n    it '公開済みのみ返す' do\n      get '/api/v1/posts'\n      expect(response).to have_http_status(:ok)\n      json = JSON.parse(response.body)\n      expect(json.size).to eq 1\n      expect(json.first['title']).to eq 't'\n      expect(response.headers['X-Total-Count']).to eq '1'\n    end\n  end\n\n  describe 'POST /api/v1/posts' do\n    it '未認証は 401' do\n      ::post '/api/v1/posts', params: { post: { title: 'x', body: 'y' } }\n      expect(response).to have_http_status(:unauthorized)\n    end\n\n    it '認証成功なら 201' do\n      ::post '/api/v1/posts', params: { post: { title: 'x', body: 'y' } }, headers: auth\n      expect(response).to have_http_status(:created)\n      json = JSON.parse(response.body)\n      expect(json['author']['name']).to eq 'Alice'\n    end\n\n    it 'バリデーションエラーは 422' do\n      ::post '/api/v1/posts', params: { post: { title: '', body: '' } }, headers: auth\n      expect(response).to have_http_status(:unprocessable_entity)\n      json = JSON.parse(response.body)\n      expect(json['error']).to eq 'validation_error'\n    end\n  end\n\n  describe 'DELETE /api/v1/posts/:id' do\n    it '他人の投稿は 403' do\n      stranger_auth = { 'Authorization' => \"Bearer \#{stranger.api_token}\" }\n      delete \"/api/v1/posts/\#{post.id}\", headers: stranger_auth\n      expect(response).to have_http_status(:forbidden)\n    end\n  end\nend`,
          },
        ],
        checkpoints: [
          "未認証 / 認証成功 / 他人 / バリデーション失敗 の 4 シナリオが pass",
          "JSON レスポンスの構造 (author.name) を検証",
          "X-Total-Count ヘッダーを検証",
          "bin/rspec が 0 failure",
        ],
        reviewPoints: [
          "request spec の network 境界を意識した書き方",
          "JSON.parse の代わりに `response.parsed_body` も Rails 7.1+ で使える",
        ],
      },
      {
        id: "06-deploy-prep",
        title: "ステップ 6: 本番準備 (環境変数 / CORS / ドキュメント)",
        goal: "本番デプロイ前のチェックリスト。CORS の絞り込み、CORS_ORIGIN 環境変数、API ドキュメント (OpenAPI / rswag)。",
        instructions:
          "本番でやらかしがちなのは **CORS の origins を `*` のまま放置** と **api_token の漏洩**。前者は他サイトから API を叩かれるリスク、後者はトークンログ出力リスク。\n\n**OpenAPI 仕様書** を rswag で生成すると、API 仕様の機械可読フォーマットができ、フロントエンドとの連携が滑らかになる。Swagger UI で対話的なドキュメントも提供できる。",
        commandHints: [
          "# CORS_ORIGIN を本番環境変数で設定",
          "export CORS_ORIGIN=https://your-spa.example.com",
          "# rswag (OpenAPI 生成)",
          "bundle add rswag",
          "bin/rails g rswag:install",
        ],
        sampleCode: [
          {
            label: "config/initializers/cors.rb (本番想定)",
            language: "ruby",
            code: `Rails.application.config.middleware.insert_before 0, Rack::Cors do\n  allow do\n    origins ENV.fetch('CORS_ORIGIN').split(',').map(&:strip)\n    resource '*',\n      headers: :any,\n      methods: %i[get post patch put delete options head],\n      expose: %w[X-Total-Count],\n      max_age: 600\n  end\nend`,
          },
          {
            label: "config/initializers/filter_parameter_logging.rb",
            language: "ruby",
            code: `Rails.application.config.filter_parameters += %i[\n  api_token authorization secret_access_key password\n]`,
          },
        ],
        checkpoints: [
          "CORS_ORIGIN を環境変数で受け取り、本番は SPA のドメインに絞っている",
          "ログにトークンが出ない (filter_parameters)",
          "RAILS_MASTER_KEY が本番環境変数として設定されている",
          "rswag で OpenAPI 仕様書 (swagger.yaml) を生成できる",
          "Rate Limiting (rack-attack) を検討",
        ],
        reviewPoints: [
          "本番 CORS は必ず絞る (* は禁忌)",
          "OpenAPI / Swagger でフロントとの契約を明文化",
          "Rate Limiting / IP 制限などのセキュリティ層",
        ],
      },
    ],
    reviewChecklist: [
      "API モード (--api) で View レイヤなしの構成",
      "namespace :api do namespace :v1 do で URL / モジュール階層",
      "Bearer トークン認証 + 401 / 403 の使い分け",
      "rescue_from で例外を統一エラーレスポンスに変換",
      "ページネーション + X-Total-Count ヘッダー",
      "N+1 対策 (includes)",
      "request spec で 4 シナリオ (未認証/認証成功/他人/422)",
      "CORS は本番では origins を絞る",
    ],
    stretch: [
      "JWT (jwt gem) で有効期限付きトークン + refresh token",
      "rswag で OpenAPI 自動生成 + Swagger UI 提供",
      "rack-attack で Rate Limiting (IP / トークン単位)",
      "GraphQL (graphql-ruby) への移行検討",
      "Stripe Webhook 受信エンドポイント (HMAC 署名検証)",
      "API バージョニング (v2 追加) の手順を整理",
    ],
    references: [
      {
        label: "Rails Guides: Using Rails for API-only Applications",
        url: "https://guides.rubyonrails.org/api_app.html",
      },
      {
        label: "jbuilder (公式 GitHub)",
        url: "https://github.com/rails/jbuilder",
      },
      {
        label: "kaminari (ページネーション)",
        url: "https://github.com/kaminari/kaminari",
      },
      {
        label: "rswag (OpenAPI 自動生成)",
        url: "https://github.com/rswag/rswag",
      },
    ],
  },
];

export const findCrudChallenge = (id: string) =>
  crudChallenges.find((c) => c.id === id);

export const crudChallengesByTrack = (trackId: TrackId) =>
  crudChallenges.filter((c) => c.trackId === trackId);
