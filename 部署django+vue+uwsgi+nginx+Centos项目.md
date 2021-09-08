#### centOS使用Nginx + uWSGI部署django + vue前后分离的项目

#### 结构或文件在的位置

<img src="img/%E9%83%A8%E7%BD%B2django+vue+uwsgi+nginx+Centos%E9%A1%B9%E7%9B%AE/image-20210817145446487.png" alt="image-20210817145446487" style="zoom:50%;" />

#### 1、项目文件打包

- vue打包  ```npm run build```，按照自己的项目进行配置其他文件即可

- django，改以下setting.py中的

  ```
  DEBUG = False
  ALLOWED_HOSTS = ['*']   #或其他要用的ip，如127.0.0.1
  ```

  然后将项目文件复制出来

#### 2、nginx的安装与配置

- **注：这里安装的nginx与其他略有不同**

- ###### 参考的安装地址：https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7

- ```
  sudo yum install epel-release
  sudo yum install nginx
  sudo systemctl start nginx
  
  #改防火墙设置
  sudo firewall-cmd --permanent --zone=public --add-service=http 
  sudo firewall-cmd --permanent --zone=public --add-service=https
  sudo firewall-cmd --reload
  
  #开机自启
  sudo systemctl enable nginx
  ```

  - 这种方式的安装**配置文件**在```/etc/nginx/```
  - 自带的指向的html文件在：```/usr/share/nginx/html/```

- ###### 配置文件参考

- ```python
  server {
          listen       80;    #监听端口
          server_name  localhost;
          location / {
              root   /usr/share/nginx/html;   #这个就是指向前端项目的地址，我用的是我这种模式安装的nginx的默认的前端文件的位置。使用下载nginx文件并解压安装的方式略有不同，也就文件位置不一样。
              
              index  index.html index.htm;
              try_files $uri $uri/ /index.html;     #这一样行是vue单页面应用需要的，vue官网抄来的
          }
          location /tem {                   #tem是我的项目请求数据的url上的一个前缀
             proxy_pass   http://127.0.0.1:8111;      #这里的写法是代理到下面个server中
          }
      }
  
  server {
          listen       8111;    #这里是监听上面代理的端口
          server_name  0.0.0.0;
          location / {
              uwsgi_pass 127.0.0.1:8556;    #这里是到uwsgi的url和端口，要与uwsgi.ini配置文件中的socket相同
              include /etc/nginx/uwsgi_params;   #这里指向的是nginx文件中的uwsgi_params文件，用其他方式解压压缩包的方式安装的nginx的uwsgi_params文件应该在  “其他路径/nginx/conf/uwsgi_params“
          }
  }
  ```

- ###### nginx常用命令

- ```
  =============   以我的方式安装的nginx   ==============
  sudo systemctl start nginx    #启动
  sudo nginx -s reload    #重启
  sudo nginx -s stop    #停止
  
  
  
  ================  采用下载解压安装的方式(到nginx的sbin目录下)   ======================
  ./nginx -s reload
  ```

- 测试，直接在浏览器中输入公网ip，只不过没数据而已，只有静态前端

  

#### 3、uwsgi的安装与配置(该项需要在虚拟环境中进行)

- ###### 安装

- ```
  pip3 install uwsgi    #为避免莫名其妙的问题，又因为项目使用的时python3.x，所以我安装时全程都使用pip3
  ```

- ###### uwsgi的常用命令

  - ```
    启动：
    uwsgi  --ini  uwsgi.ini
    
    停止：
    uwsgi --stop uwsgi.pid
    
    重启：（当然是启动的时候重启啦啊）
    uwsgi --reload uwsgi.pid
    ```

  - 









#### 遇到的坑

- ##### 1，部署好后访问时遇到报错

  - ![image-20210817154659961](img/%E9%83%A8%E7%BD%B2django+vue+uwsgi+nginx+Centos%E9%A1%B9%E7%9B%AE/image-20210817154659961.png)
  - ***前端问题***，写前端时我用了publicPath: "./" ，以下情况不应使用publicPath
  - 当使用基于 HTML5 history.pushState  的路由时；
  - 当使用 pages 选项构建多页面应用时。
  - 官方说明文档 https://cli.vuejs.org/zh/config/#publicpath

- 后端在部署时也有方式解决(具体我没尝试)，配置nginx

- ```
          location @router{
              rewrite ^.*$ /index.html last;
          }
  ```

- 参考链接：https://cloud.tencent.com/developer/article/1538575

  

- ##### 2、安装uwsgi报错

  - 需要安装依赖

  - ```
    yum -y install python36-devel
    ```

- ##### 3、另外遇到一个超级大坑

  - 那就是uwsgi连不上项目文件，uwsgi.ini文件配置没问题(后来重新成功部署也用的这个文件)，nginx配置也没问题，网页能访问，前端一直报500，uwsgi的日志文件一直报错  没有找打python application  。最后没解决，重置了服务器重新部署了。