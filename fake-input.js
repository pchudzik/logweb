'use strict';

var _ = require('lodash');

var index = 0;
var messagesCount = process.argv.slice(2, 3)[0] || Number.MAX_SAFE_INTEGER;
var maxSleepTime = process.argv.slice(3, 4)[0] || 1000;
var messages = sampleMessages();

process.stderr.write(`sleep time ${maxSleepTime}ms messages to send ${messagesCount}\n\n`);

var contentToSend = [];

shouldCallNextLine();

function shouldCallNextLine() {
	if (index < messagesCount) {
		setTimeout(() => sendLine(shouldCallNextLine), randomSleepTime());
	}
}
function sendLine(callback) {
	if (contentToSend.length === 0) {
		contentToSend = messages[Math.floor(Math.random() * messages.length)].content;
		return callback();
	}

	process.stdout.write(_.head(contentToSend));

	contentToSend = _.drop(contentToSend);

	index++;
	return callback();
}

function randomSleepTime() {
	return Math.floor(Math.random() * maxSleepTime);
}

function sampleMessages() {
	return [
		{content: sampleStacktrace()},
		{content: multipeleLogMessages()},
		{content: xmlResponse()},
		{content: otherStacktrace()}
	];
}

function xmlResponse() {
	return [
		`2016-09-12 10:21:18,176 INFO [ServerService Thread Pool -- 63] sample application xml response\n<?xml version="1.0"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" 
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
 <SOAP-ENV:Body>
  <UPDATE__CompIntfc__SDK_BUS_EXP>`,
		`    <SDK_EMPLID>8001</SDK_EMPLID>
    <SDK_BUS_EXP_PER>
      <SDK_EXP_PER_DT>08/14/2002</SDK_EXP_PER_DT>
        <SDK_BUS_EXP_DTL>
          <SDK_CHARGE_DT>08/14/2002</SDK_CHARGE_DT>
          <SDK_EXPENSE_CD>01`,
		`</SDK_EXPENSE_CD>
          <SDK_EXPENSE_AMT>1234.56</SDK_EXPENSE_AMT>
          <SDK_CURRENCY_CD>USD</SDK_CURRENCY_CD>
          <SDK_BUS_PURPOSE>Client Visit</SDK_BUS_PURPOSE>
          <SDK_DEPTID>10100</SDK_DEPTID>
        </SDK_BUS_EXP_DTL>
    </SDK_BUS_EXP_PER>
  </UPDATE__CompIntfc__SDK_BUS_EXP>
 </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
	];
}

function multipeleLogMessages() {
	return [
		'2016-09-12 10:21:15,283 INFO [ServerService Thread Pool -- 63] org.springframework.web.context.ContextLoader - Root WebApplicationContext: initialization started\n2016-09-12 10:21:15,288 INFO [ServerService Thread Pool -- 63] org.springframework.web.context.support.AnnotationConfigWebApplicationContext - Refreshing Root WebApplicationContext: startup date [Mon Sep 12 10:21:15 CEST 2016]; root of context hierarchy\n',
		'2016-09-12 10:21:15,369 INFO [ServerService Thread Pool -- 63] org.springframework.web.context.support.AnnotationConfigWebApplicationContext - Registering annotated classes: [class com.example.package.ContextScan]\n2016-09-12 10:21:16,857 INFO [ServerService Thread Pool -- 63] org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loading XML bean definitions from class path resource [spring/persistence.xml]\n',
		'2016-09-12 10:21:17,168 INFO [ServerService Thread Pool -- 63] org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loading XML bean definitions from class path resource [spring/scheduler.xml]\n',
		'2016-09-12 10:21:18,176 INFO [ServerService Thread Pool -- 63] org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor - JSR-330 "javax.inject.Inject" annotation found and supported for autowiring\n',
		'2016-09-12 10:21:19,765 INFO [MLog-Init-Reporter] com.mchange.v2.log.MLog - MLog clients',
		'using slf4j logging.\n',
		'2016-09-12 10:21:19,831 INFO [ServerService Thread Pool -- 63] com.mchange.v2.c3p0.C3P0Registry - Initializing c3p0-0.9.5 [built 02-January-2015 13:25:04 -0500; debug? true; trace: 10]\n',
		'2016-09-12 10:21:20,272 INFO [ServerService Thread Pool -- 63] org.flywaydb.core.internal.util.VersionPrinter - Flyway 4.0.3 by Boxfuse\n',
		'2016-09-12 10:21:20,301 INFO [ServerService Thread Pool -- 63] com.mchange.v2.c3p0.impl.AbstractPoolBackedDataSource - Initializing c3p0 pool... com.mchange.v2.c3p0.ComboPooledDataSource ' +
		'[ acquireIncrement -> 3, acquireRetryAttempts -> 30, acquireRetryDelay -> 1000, autoCommitOnClose -> false, automaticTestTable -> null, breakAfterAcquireFailure -> false, ' +
		'checkoutTimeout -> 0, connectionCustomizerClassName -> null, connectionTesterClassName -> com.mchange.v2.c3p0.impl.DefaultConnectionTester, ' +
		'contextClassLoaderSource -> caller, dataSourceName -> 2wdv739j86j2veuofs51|45c2194d, debugUnreturnedConnectionStackTraces -> false, description -> null, ' +
		'driverClass -> oracle.jdbc.driver.OracleDriver, extensions -> {}, factoryClassLocation -> null, forceIgnoreUnresolvedTransactions -> false, ' +
		'forceUseNamedDriverClass -> false, identityToken -> 2wdv739j86j2veuofs51|45c2194d, idleConnectionTestPeriod -> 0, initialPoolSize -> 3, ',
		'jdbcUrl -> jdbc:oracle:thin:@() (CONNECT_DATA = ())), maxAdministrativeTaskTime -> 0, maxConnectionAge -> 0, maxIdleTime -> 0, ' +
		'maxIdleTimeExcessConnections -> 0, maxPoolSize -> 15, maxStatements -> 0, maxStatementsPerConnection -> 0, minPoolSize -> 3, ',
		'numHelperThreads -> 3, preferredTestQuery -> null, privilegeSpawnedThreads -> false, properties -> {user=******, password=******}, ' +
		'propertyCycle -> 0, statementCacheNumDeferredCloseThreads -> 0, testConnectionOnCheckin -> false, testConnectionOnCheckout -> false, ' +
		'unreturnedConnectionTimeout -> 0, userOverrides -> {}, usesTraditionalReflectiveProxies -> false ]\n',
		'2016-09-12 10:21:20,681 INFO [ServerService Thread Pool -- 63] org.flywaydb.core.internal.dbsupport.DbSupportFactory - Database: jdbc:oracle:thin:@() (Oracle 11.2)\n',
		'2016-09-12 10:21:20,991 INFO [ServerService Thread Pool -- 63] org.flywaydb.core.internal.command.DbValidate - Successfully validated 23 migrations (execution time 00:00.048s\n',
		'2015-12-22 13:11:08,669 [INFO] from play.api.libs.concurrent.ActorSystemProvider in pool-1-thread-1 - Starting application default Akka system: application',
		'2015-12-22 13:11:09,563 [INFO] from play.api.libs.concurrent.ActorSystemProvider in pool-1-thread-1 - Shutdown application default Akka system: application',
		'2015-12-22 13:11:11,777 [INFO] from play.api.libs.concurrent.ActorSystemProvider in pool-1-thread-1 - Starting application default Akka system: application',
		`
2013-08-09 08:19:48,580 - [INFO] - from play in main 
Application started (Prod)

`,
		`2013-08-09 08:19:48,661 - [INFO] - from play in main 
Listening for HTTP on /127.0.0.1:8888

2013-08-09 08:19:53,064 - [INFO] - from application in default-akka.actor.default-dispatcher-5 
WebSocket `,
		`streams created

2013-08-09 08:19:53,207 - [DEBUG] - from application in play-akka.actor.default-dispatcher-2 
Checking mime type for /home/noootsab/octave-core, found: application/octet-stream

2013-08-09 08:19:53,211 - [DEBUG] - from application in play-akka.actor.default-dispatcher-2 
Checking mime type for /home/noootsab/Downloads (1), found: application/pdf

2013-08-09 08:55:59,047 - [INFO] - from application in play-akka.actor.default-dispatcher-4 
sbt told us the name is: 'angular-seed-play'

2013-08-09 08:55:59,056 - [DEBUG] - from application in play-akka.actor.default-dispatcher-4 
Stopping sbt child because we got our app config or error Success(ProcessSuccess(AppConfig(/home/noootsab/belighted-pre,angular-seed-play,Some(angular-seed-play))))

2013-08-09 08:55:59,382 - [INFO] - from application in New I/O worker #5 
Connect request for app id: angular-seed-play

2013-08-09 08:55:59,386 - [INFO] - from application in play-akka.actor.default-dispatcher-8 
WebSocket streams created

2013-08-09 08:55:59,808 - [DEBUG] - from application in play-akka.actor.default-dispatcher-11 
Checking mime type for /home/noootsab/belighted-pre/activator-launch-0.2.6.jar, found: application/zip

2013-08-09 08:55:59,815 - [DEBUG] - from application in play-akka.actor.default-dispatcher-11 
Checking mime type for /home/noootsab/belighted-pre/activator, found: application/x-shellscript

2013-08-09 08:55:59,819 - [DEBUG] - from application in play-akka.actor.default-dispatcher-11 
Checking mime type for /home/noootsab/belighted-pre/LICENSE, found: application/octet-stream

2013-08-09 08:56:04,608 - [DEBUG] - from application in ForkJoinPool-3-worker-3 
Sending app actor 4 source files

2013-08-09 08:56:34,506 - [DEBUG] - from application in ForkJoinPool-3-worker-8 
Sending app actor 4 source files

2013-08-09 08:57:23,143 - [INFO] - from application in New I/O worker #1 
Connect request for app id: angular-seed-play

2013-08-09 08:57:23,144 - [INFO] - from application in play-akka.actor.default-dispatcher-15 
WebSocket streams created

2013-08-09 08:57:23,565 - [DEBUG] - from application in play-akka.actor.default-dispatcher-16 
Checking mime type for /home/noootsab/belighted-pre/activator-launch-0.2.6.jar, found: application/zip

2013-08-09 08:57:23,569 - [DEBUG] - from application in play-akka.actor.default-dispatcher-16 
Checking mime type for /home/noootsab/belighted-pre/activator, found: application/x-shellscript

`,
		`2013-08-09 08:57:23,572 - [DEBUG] - from application in play-akka.actor.default-dispatcher-16 
Checking mime type for /home/noootsab/belighted-pre/LICENSE, found: application/octet-stream

2013-08-09 08:57:28,111 - [DEBUG] - from application in ForkJoinPool-3-worker-9 
Sending app actor 5 source files

2013-08-09 08:57:29,221 - [DEBUG] - from application in ForkJoinPool-3-worker-14 
Sending app actor 5 source files

2013-08-09 17:02:35,450 - [INFO] - from application in Thread-4 
onStop received closing down the app

2013-08-09 17:02:35,451 - [WARN] - from application in Thread-4 
AppManager onApplicationStop is disabled pending some refactoring so it works with FakeApplication in tests

2013-08-09 22:56:37,210 - [INFO] - from play in main 
Application started (Prod)
`, `
2013-08-09 22:56:37,330 - [INFO] - from play in main 
Listening for HTTP on /127.0.0.1:8888

2013-08-09 22:56:41,933 - [INFO] - from application in default-akka.actor.default-dispatcher-4 
WebSocket streams created

2013-08-09 22:56:42,090 - [DEBUG] - from application in play-akka.actor.default-dispatcher-4 
Checking mime type for /home/noootsab/octave-core, found: application/octet-stream

2013-08-09 22:56:42,094 - [DEBUG] - from application in play-akka.actor.default-dispatcher-4 
Checking mime type for /home/noootsab/Downloads (1), found: application/pdf

2013-08-09 22:58:17,206 - [INFO] - from application in play-akka.actor.default-dispatcher-2 
sbt told us the name is: 'six-minute-apps'

2013-08-09 22:58:17,222 - [DEBUG] - from application in play-akka.actor.default-dispatcher-2 
Stopping sbt child because we got our app config or error Success(ProcessSuccess(AppConfig(/home/noootsab/src/betest,six-minute-apps,Some(six-minute-apps))))

2013-08-09 22:58:17,847 - [INFO] - from application in New I/O worker #2 
Connect request for app id: six-minute-apps
`, `
2013-08-09 22:58:17,850 - [INFO] - from application in play-akka.actor.default-dispatcher-7 
WebSocket streams created

2013-08-09 22:58:18,298 - [DEBUG] - from application in play-akka.actor.default-dispatcher-8 
Checking mime type for /home/noootsab/src/betest/activator-launch-0.2.6.jar, found: application/zip

2013-08-09 22:58:18,301 - [DEBUG] - from application in play-akka.actor.default-dispatcher-8 
Checking mime type for /home/noootsab/src/betest/activator, found: application/x-shellscript

2013-08-09 22:58:18,309 - [DEBUG] - from application in play-akka.actor.default-dispatcher-8 
Checking mime type for /home/noootsab/src/betest/LICENSE, found: application/octet-str`, `eam

2013-08-09 22:58:24,047 - [DEBUG] - from application in ForkJoinPool-3-worker-5 
Sending app actor 14 source files

2013-08-09 22:59:06,505 - [DEBUG] - from application in ForkJoinPool-3-worker-9 
Sending app actor 14 source files

2013-08-09 23:04:06,322 - [DEBUG] - from application in ForkJoinPool-3-worker-12 
Sending app actor 14 source files

2013-08-09 23:06:02,332 - [INFO] - from application in Thread-8 
onStop received closing down the app

2013-08-09 23:06:02,333 - [WARN] - from application in Thread-8 
AppManager onApplicationStop is disabled pending some refactoring so it works with FakeApplication in tests

2013-08-10 10:41:40,881 - [INFO] - from play in main 
Application started (Prod)

2013-08-10 10:41:40,974 - [INFO] - from play in main 
Listening for HTTP on /127.0.0.1:8888

2013-08-10 10:41:45,750 - [INFO] - from application in default-akka.actor.default-dispatcher-4 
WebSocket streams created
`, `
2013-08-10 10:41:45,932 - [DEBUG] - from application in play-akka.actor.default-dispatcher-8 
Checking mime type for /home/noootsab/octave-core, found: application/octet-stream

2013-08-10 10:41:45,936 - [DEBUG] - from application in play-akka.actor.default-dispatcher-8 
Checking mime type for /home/noootsab/Downloads (1), found: application/pdf

2013-08-10 10:42:06,600 - [INFO] - from application in Thread-8 
onStop received closing down the app

2013-08-10 10:42:06,603 - [WARN] - from application in Thread-8 
AppManager onApplicationStop is disabled pending some refactoring so it works with FakeApplication in tests

2013-08-10 10:43:40,638 - [INFO] - from play in main 
Application started (Prod)

2013-08-10 10:43:40,726 - [INFO] - from play in main 
Listening for HTTP on /127.0.0.1:8888

2013-08-10 10:43:43,756 - [INFO] - from application in default-akka.actor.default-dispatcher-4 
WebSocket streams created

2013-08-10 10:43:43,907 - [DEBUG] - from application in `, `play-akka.actor.default-dispatcher-5 
Checking mime type for /home/noootsab/octave-core, found: application/octet-stream

2013-08-10 10:43:43,911 - [DEBUG] - from application in play-akka.actor.default-dispatcher-5 
Checking mime type for /home/noootsab/Downloads (1), found: application/pdf

2013-08-10 10:48:27,066 - [INFO] - from application in play-akka.actor.default-dispatcher-3 
sbt told us the name is: 'sse-chat'

2013-08-10 10:48:27,082 - [DEBUG] - from application in play-akka.actor.default-dispatcher-3 
Stopping sbt child because we got our app config or error Success(ProcessSuccess(AppConfig(/home/noootsab/belighted-pre,sse-chat,Some(sse-chat))))

2013-08-10 10:48:27,626 - [INFO] - from application in New I/O worker #2 
Connect request for app id: sse-chat

2013-08-10 10:48:27,629 - [INFO] - from application in play-akka.actor.default-dispatcher-9 
WebSocket streams created

2013-08-10 10:48:28,100 - [DEBUG] - from application in play-akka.actor.default-dispatcher-10 
Checking mime type for /home/noootsab/belighted-pre/activator-launch-0.2.6.jar, found: application/zip

2013-08-10 10:48:28,104 - [DEBUG] - from application in play-akka.actor.default-dispatcher-10 
Checking mime type for /home/noootsab/belighted-pre/activator, found: application/x-shellscript

2013-08-10 10:48:28,109 - [DEBUG] - from application in play-akka.actor.default-dispatcher-10 
Checking mime type for /home/noo`, `otsab/belighted-pre/LICENSE, found: application/octet-stream

2013-08-10 10:48:32,850 - [DEBUG] - from application in ForkJoinPool-3-worker-6 
Sending app actor 14 source files

2013-08-10 10:48:59,666 - [DEBUG] - from application in ForkJoinPool-3-worker-9 
Sending app actor 14 source files

2013-08-10 11:06:17,507 - [INFO] - from application in default-akka.actor.default-dispatcher-14 
WebSocket streams created

2013-08-10 11:06:17,610 - [DEBUG] - from application in play-akka.actor.default-dispatcher-38 
Checking mime type for /home/noootsab/octave-core, found: application/octet-stream

2013-08-10 11:06:17,614 - [DEBUG] - from application in play-akka.actor.default-dispatcher-38 
Checking mime type for /home/noootsab/Downloads (1), found: application/pdf

2013-08-10 11:07:10,424 - [INFO] - from application in play-akka.actor.default-dispatcher-35 
sbt told us the name is: 'six-minute-apps'

2013-08-10 11:07:10,429 - [DEBUG] - from application in play-akka.actor.default-dispatcher-35 
Stopping sbt child because we got our app config or error Success(ProcessSuccess(AppConfig(/home/noootsab/jw6app,six-minute-apps,Some(six-minute-apps))))

2013-08-10 11:07:13,031 - [INFO] - from application in New I/O worker #2 
Connect request for app id: six-minute-apps

2013-08-10 11:07:13,033 - [INFO] - from application in play-akka.actor.default-dispatcher-35 
WebSocket streams created

2013-08-10 11:07:16,000 - [DEBUG] - from application in play-akka.actor.default-dispatcher-41 
Checking mime type for /home/noootsab/jw6app/activator-launch-0.2.6.jar, found: application/zip

2013-08-10 11:07:16,006 - [DEBUG] - from`, ` application in play-akka.actor.default-dispatcher-41 
Checking mime type for /home/noootsab/jw6app/activator, found: application/x-shellscript

2013-08-10 11:07:16,010 - [DEBUG] - from application in play-akka.actor.default-dispatcher-41 
Checking mime type for /home/noootsab/jw6app/LICENSE, found: application/octet-stream

2013-08-10 11:07:20,860 - [DEBUG] - from application in ForkJoinPool-3-worker-2 
Sending app actor 14 source files

2013-08-10 11:07:43,712 - [DEBUG] - from application in ForkJoinPool-3-worker-18 
Sending app actor 14 source files

2013-08-10 15:49:25,747 - [INFO] - from application in Thread-8 
onStop received closing down the app`, `

`, '2013-08-10 15:49:25,748 - [WARN] - from application in Thread-8',
		'AppManager onApplicationStop is disabled pending some refactoring so it works with FakeApplication in tests',
	];
}

function otherStacktrace() {
	return [`
2013-09-14 13:12:23,551|FATAL|0.205||BaseConverterModule|javax.persistence.PersistenceException: com.clarkparsia.empire.ds.QueryException: org.openrdf.repository.http.HTTPQueryEvaluationException: Java heap space
org.datalift.fwk.project.PersistenceException: javax.persistence.PersistenceException: com.clarkparsia.empire.ds.QueryException: org.openrdf.repository.http.HTTPQueryEvaluationException: Java heap space
	at org.datalift.core.project.GenericRdfJpaDao.find(GenericRdfJpaDao.java:276)
	at org.datalift.core.project.GenericRdfJpaDao.find(GenericRdfJpaDao.java:155)
	at org.datalift.core.project.DefaultProjectManager.findProject(DefaultProjectManager.java:179)
	at org.datalift.converter.BaseConverterModule.getProject(BaseConverterModule.java:242)
	at org.datalift.converter.RdfTransformer.convertRdfSource(RdfTransformer.java:131)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25)
	at java.lang.reflect.Method.invoke(Method.java:597)
	at com.sun.jersey.spi.container.JavaMethodInvokerFactory$1.invoke(JavaMethodInvokerFactory.java:60)
	at com.sun.jersey.server.impl.model.method.dispatch.AbstractResourceMethodDispatchProvider$ResponseOutInvoker._dispatch(AbstractResourceMethodDispatchProvider.java:205)
	at com.sun.jersey.server.impl.model.method.dispatch.ResourceJavaMethodDispatcher.dispatch(ResourceJavaMethodDispatcher.java:75)
	at com.sun.jersey.server.impl.uri.rules.HttpMethodRule.accept(HttpMethodRule.java:288)
	at com.sun.jersey.server.impl.uri.rules.ResourceObjectRule.accept(ResourceObjectRule.java:100)
	at com.sun.jersey.server.impl.uri.rules.RightHandPathRule.accept(RightHandPathRule.java:147)
	at com.sun.jersey.server.impl.uri.rules.RootResourceClassesRule.accept(RootResourceClassesRule.java:84)
	at com.sun.jersey.server.impl.application.WebApplicationImpl._handleRequest(WebApplicationImpl.java:1469)
	at com.sun.jersey.server.impl.application.WebApplicationImpl._`,`handleRequest(WebApplicationImpl.java:1400)
	at com.sun.jersey.server.impl.application.WebApplicationImpl.handleRequest(WebApplicationImpl.java:1349)
	at com.sun.jersey.server.impl.application.WebApplicationImpl.handleRequest(WebApplicationImpl.java:1339)
	at com.sun.jersey.spi.container.servlet.WebComponent.service(WebComponent.java:416)
	at com.sun.jersey.spi.container.servlet.ServletContainer.service(ServletContainer.java:537)
	at com.sun.jersey.spi.container.servlet.ServletContainer.doFilter(ServletContainer.java:895)
	at com.sun.jersey.spi.container.servlet.ServletContainer.doFilter(ServletContainer.java:843)
	at com.sun.jersey.spi.container.servlet.ServletContainer.doFilter(ServletContainer.java:804)`,`
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.datalift.core.util.web.ResponseHeaderFilter.doFilter(ResponseHeaderFilter.java:102)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.datalift.core.util.web.RequestLifecycleFilter.doFilter(RequestLifecycleFilter.java:97)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.datalift.core.log.web.LogContextFilter.doFilter(LogContextFilter.java:145)`,`
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.datalift.core.i18n.web.PreferredLocalesFilter.doFilter(PreferredLocalesFilter.java:138)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.datalift.core.util.web.CharacterEncodingFilter.doFilter(`,`CharacterEncodingFilter.java:135)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1212)
	at org.mortbay.jetty.servlet.ServletHandler.handle(ServletHandler.java:399)
	at org.mortbay.jetty.security.SecurityHandler.handle(SecurityHandler.java:216)
	at org.mortbay.jetty.servlet.SessionHan`,`dler.handle(SessionHandler.java:182)
	at org.mortbay.jetty.handler.ContextHandler.handle(ContextHandler.java:766)
	at org.mortbay.jetty.webapp.WebAppContext.handle(WebAppContext.java:450)
	at org.mortbay.jetty.handler.HandlerCollection.handle(HandlerCollection.java:114)
	at org.mortbay.jetty.handler.HandlerWrapper.handle(HandlerWrapper.java:152)
	at org.mortbay.jetty.Server.handle(Server.java:326)
	at org.mortbay.jetty.HttpConnection.handleRequest(HttpConnection.java:542)
	at org.mortbay.jetty.HttpConnection$RequestHandler.content(HttpConnection.java:945)
	at org.mortbay.jetty.HttpParser.parseNext(HttpParser.java:756)
	at org.mortbay.jetty.HttpParser.parseAvailable(HttpParser.java:218)
	at org.mortbay.jetty.HttpConnection.handle(HttpConnection.java:404)
	at org.mortbay.jetty.bio.SocketConnector$Connection.run(SocketConnector.java:228)
	at org.mortbay.thread.QueuedThreadPool$PoolThread.run(QueuedThreadPool.java:582)
Caused by: javax.persistence.PersistenceException: com.clarkparsia.empire.ds.QueryException: org.openrdf.repository.http.HTTPQueryEvaluationException: Java heap space
	at com.clarkparsia.empire.`,`impl.EntityManagerImpl.find(EntityManagerImpl.java:667)
	at org.datalift.core.project.GenericRdfJpaDao.find(GenericRdfJpaDao.java:270)
	... 50 more
Caused by: com.clarkparsia.empire.ds.QueryException: org.openrdf.repository.http.HTTPQueryEvaluationException: Java heap space
	at com.clarkparsia.e`,`mpire.sesametwo.RepositoryDataSource.ask(RepositoryDataSource.java:253)
	at com.clarkparsia.empire.ds.DataSourceUtil.exists(DataSourceUtil.java:193)
	at com.clarkparsia.empire.impl.EntityManagerImpl.find(EntityManagerImpl.java:652)
	... 51 more
Caused by: org.openrdf.repository.http.HTTPQueryEvaluationException: Java heap space
	at org.openrdf.repository.http.HTTPBooleanQuery.evaluate(HTTPBooleanQuery.java:45)
	at com.clarkparsia.empire.sesametwo.RepositoryDataSource.ask(RepositoryDataSource.java:246)
	... 53 more
Caused by: org.openrdf.repository.RepositoryException: Java heap space
	at org.openrdf.http.client.HTTPClient.getBoolean(HTTPClient.java:1294)
	at org.openrdf.http.client.HTTPClient.sendBooleanQuery(HTTPClient.java:546)
	at org.openrd`,`f.repository.http.HTTPBooleanQuery.evaluate(HTTPBooleanQuery.java:38)
	... 54 more
2013-09-14 13:12:23,557|ERROR|0.211||ContainerResponse|Mapped exception to response: 500 (Internal Server Error)
`];
}

function sampleStacktrace() {
	return [`
2016-09-18 14:23:36,892 ERROR [org.jboss.modcluster] (ContainerBackgroundProcessor[StandardEngine[jboss.web]]) Whatever: Failed to send STATUS to example.com/11.22.33.44:80: java.net.SocketTimeoutException: connect timed out
	at java.net.PlainSocketImpl.socketConnect(Native Method) [rt.jar:1.8.0_65]
	at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350) [rt.jar:1.8.0_65]
	at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206) [rt.jar:1.8.0_65]
	at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188) [rt.jar:1.8.0_65]
	at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392) [rt.jar:1.8.0_65]
	at java.net.Socket.connect(Socket.java:589) [rt.jar:1.8.0_65]
	at org.jboss.modcluster.mcmp.impl.DefaultMCMPHandler$Proxy.getConnection(DefaultMCMPHandler.java:835)
	at org.jboss.modcluster.mcmp.impl.Default`,
		`MCMPHandler$Proxy.getConnectionWriter(DefaultMCMPHandler.java:858)
	at org.jboss.modcluster.mcmp.impl.DefaultMCMPHandler.sendRequest(DefaultMCMPHandler.java:499)
	at org.jboss.modcluster.mcmp.impl.DefaultMCMPHandler.sendRequest(DefaultMCMPHandler.java:600)
	at org.jboss.modcluster.mcmp.impl.DefaultMCMPHandler.sendRequest(DefaultMCMPHandler.java:414)
	at org.jboss.modcluster.ModClusterService.status(ModClusterService.java:468)`,
		`at org.jboss.modcluster.container.catalina.CatalinaEventHandlerAdapter.lifecycleEvent(CatalinaEventHandlerAdapter.java:249)
	at org.apache.catalina.util.LifecycleSupport.fireLifecycleEvent(LifecycleSupport.java:115) [jbossweb-7.5.11.Final-redhat-1.jar:7.5.11.Final-redhat-1]
	at org.apache.catalina.core.ContainerBase.backgroundProcess(ContainerBase.java:1323) [jbossweb-7.5.11.Final-redhat-1.jar:7.5.11.Final-redhat-1]
	at org.apache.catalina.core.ContainerBase$`,
		`ContainerBackgroundProcessor.processChildren(ContainerBase.java:1588) [jbossweb-7.5.11.Final-redhat-1.jar:7.5.11.Final-redhat-1]
	at org.apache.catalina.core.ContainerBase$ContainerBackgroundProcessor.run(ContainerBase.java:1574) [jbossweb-7.5.11.Final-redhat-1.jar:7.5.11.Final-redhat-1]
	at java.lang.Thread.run(Thread.java:745) [rt.jar:1.8.0_65]\n`];
}
