# The Poli-Graph

This project is intended to demonstrate how The Poli-Graph is build. Feel free to browse for inspiration and [check out The Poli-Graph here.](http://poligraph.live/)

The project is based on a .NET multi tenant solution I created a long time ago, so there might be some odd implementations here and there.

### Requirements

  * Windows
  * Visual Studio
  * MS SQL Server
  * .NET Framework 4.5.2
  * Node and npm

### Quick Start

#### 1. Get the code

Start by cloning the repository onto your local machine by running:

```shell
$ git clone https://github.com/iqueryable/poligraph.git
$ cd poligraph
```

#### 2. Install Client Modules and Components

This will install required Node Modules and Bower Components.

```shell
$ cd Konvention.Adsembler.Web.Microsites/Client/
$ npm Install
$ bower install
```

#### 3. Build the Client

This will build the source code for the Client into the `dist ` folder. This might take a while due to image optimizations.

```shell
$ cd sites/poligraph/
$ gulp
```

#### 4. Import the database

The database has been included as a Data-tier Application and can be found Inside the `Database` folder. Import into an MS SQL Server using the `Import Data-tier Application` feature.

#### 5. Build the .NET solution

Open `Konvention.Adsembler.Web.Microsites.sln` in Visual Studio and build it using `ctrl+shift+b`. NuGet packages should automatically be restored.

#### 6. Edit database connection string

If you imported the database on your localhost, you can skip this step. Otherwise open the `web.config` and edit the below line.

```
<add name="ApplicationDbContext" connectionString="Data Source=.;Initial Catalog=adsm_microsites;Integrated Security=True;Connect Timeout=30" providerName="System.Data.SqlClient" />
```
#### 6. Start the website

Start the website using `ctrl+f5` or `f5` for debugging purposes. The website should automatically open on [http://localhost:8928/](http://localhost:8928/).

### Webhooks

The site uses a webhook to receive lies which is stored in the database and broadcasted onto the website. Lies are based on an [RSS feed](http://www.politifact.com/feeds/statementsby/donald-trump/) from [PolitiFact](http://www.politifact.com/) using [Zapier](https://zapier.com/) to monitor for changes and send them to the webhook.

The webhook then basically checks if the description of the feed item starts with one of the below predictable sentences and if so, it'll be counted as a lie.

   * The Truth-o-Meter says: Full Flop
   * The Truth-o-Meter says: Pants on Fire
   * The Truth-o-Meter says: False
   * The Truth-o-Meter says: Mostly False
   * The Truth-o-Meter says: Half-True

The webhook is secureed by a token which can be found and edited in the `web.config`.

```
<add key="MS_WebHookReceiverSecret_GenericJson" value="poligraph=c7cc823b273443c0a9e38c09729eae9e" />
```

### Backoffice

The backoffice was intended as a way to manully post lies since the website was only based on data from PolitiFact and can be accessed on [http://localhost:8928/backoffice](http://localhost:8928/backoffice). Use the below username and password when prompted to login.

   * Username: admin
   * Password: P@ssw0rd

You can modify these credentials in the `web.config` by editing the below lines.

```
<add key="BasicAuthentication.Username.localhost" value="admin"/>
<add key="BasicAuthentication.Password.localhost" value="P@ssw0rd"/>
```

The backoffice is intended to post lies onto the website by specifying a source, title, link and date. The lie will instantly be shown on the website using socket technology unless you check the `Don't brodcast` checbox.

In either case the lie will still be stored in the database.

### Links

The Poli-Graph has been mentioned and showcased on the following. Ironically some the news sites forgot to fact check the fact checking website creators, who claim to be using an AI to scan the internet for false statements.

   * https://www.trendhunter.com/trends/poligraph
   * http://bureaubiz.dk/to-ader-bag-loegnedetektor/
   * http://markedsforing.dk/artikler/kampagner/hvor-mange-l-gne-magter-trump
   * https://issuu.com/futurepublishing/docs/wdr262.issuu
   * https://vimeo.com/221249684
   * https://thefwa.com/cases/the-poli-graph
   * https://www.awwwards.com/sites/the-poli-graph
