## Better iOS Device Logs using Sublime Text

### Problem

When looking on iOS device logs, it is filled with many entries from many processes… most of them are irrelevant and it makes it hard to understand the context. 

***

### Goal

Being able to filter the log lines and include only such coming from specific processes.

***

### How

* Install Sublime text 3 + Filter Lines plugin, usually it is preinstalled but you can get it from 
_https://packagecontrol.io/packages/Filter%20Lines_
  * Open iOS device log with ST3
  * On the Edit > Line menu:
* Include Lines With Regex ⌘+K ⌘+R
* How to build the RegEx?
  * For every process we want to see in the results:
    * #PROC-NAME.*[#PROC-NUM] à for example, from our agent running on process #208 we’ll add ‘HP4M-Agent.*[208]’
    * Why ‘.*’ ? -We want all the log entries from agent process (#208), some of them are coming from libraries inside the agent and in the device log they appear differently (HP4M-Agent(CFNetwork)[208])
  * To include several processes I’m using - “|” ( ==regex OR) to chain several rules.
* I will give an example for a regrex that filter log lines coming from 3 processes:
  * Agent on proc #208
  * WDARunner on proc #199
  * AUT on proc #251

-> HP4M-Agent.*[208]|WebDriverAgentRunner-Runner.*[199]|MySunlife.*[251]

 
