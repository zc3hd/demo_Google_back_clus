/**
 * Item Name  : 
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.1.16
 *@pararm     :
 */
(function($, window) {

  function diyGMap(opts) {
    // 地图容器标识
    this.id = opts.id;

    // 谷歌的地图的全局变量
    this.Gmap = google.maps;


    // 选择到的项目id
    this.item_ids = "1";

    // --------------------------------------------聚合模式--层点的收集
    this.ceng_p_arr = [];

    // 监控层的收集
    this.jk_p_arr = [];
    // 追踪层的收集
    this.trail_p_arr = [];
    // 追踪层的线的收集
    this.trail_line_arr = [];


    // --------------------------------------------普通模式--层点的收集
    this.pt_jk_p_arr = [];
    // 追踪层的收集
    this.pt_trail_p_arr = [];
    // 追踪层的线的收集
    this.pt_trail_line_arr = [];

  };
  diyGMap.prototype = {
    // 入口函数
    init: function() {
      var me = this;
      // 初始控件和地图
      me.init_mapBaner();
      me.init_map_convert();
      // 初始化事件
      me.init_event();
    },
    // -----------------------------------------组件初始
    //控件默认初始化
    init_mapBaner: function() {
      var me = this;
      me.map = new me.Gmap.Map($('#' + me.id)[0], {
        center: {
          lat: 39.920026,
          lng: 116.403694
        },
        zoom: 11,
        // 地图类型控件
        mapTypeControl: false,
        mapTypeControlOptions: {
          // 展示的形式
          // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          // 要地图类型的控件
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            // google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID
          ],
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        // 缩放控件
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,

        // 全景模式开启
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });

      layer.msg('已转换至【google地图】观察模式');
    },
    //控件自定义初始化
    init_setBaner: function() {
      var me = this;
    },
    init_event: function() {
      var me = this;
      // -----------项目选择
      me.item_bind();
      me.item();
    },
    init_map_convert: function() {
      var me = this;
      var index = null;
      $('#convert_map img').on('mouseover', function() {
        index = layer.msg('点击转换至【baidu地图】观察模式', { time: 0 });
      });
      $('#convert_map img').on('mouseout', function() {
        layer.close(index)
        $('#convert_map')[0].style.animation = 'move_back 0.5s forwards';
      });
      $('#convert_map img').on('click', function() {
        
      });
    },
    // --------------------------------------项目模式选择
    item: function(argument) {
      var me = this;
      me.i_init();
    },
    item_bind: function() {
      var me = this;
      var fn = {
        i_init: function(argument) {
          var me = this;
          // 自定义控件渲染
          me.i_bar();
          me.i_change();

          // 函数绑定
          me.clus_bind();

          // 默认选择--第一个项目--聚合的数据;
          me.last_swicth_data({ item_id: me.item_ids, mode_id: 1 });
        },
        // 自定义控件渲染
        i_bar: function() {
          var me = this;

          // -------------------------------模式选择条
          me.mode_btns = document.createElement('div');
          new NewControl({
            p_dom: me.mode_btns,
            map: me.map,
            offset: ['10px', 0, 0, '212px'],
            btns: ['聚合模式juhe', '普通模式puto']
          }).init();
          me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.mode_btns);

          // 模式做标识  聚合是1，普通是0，在生成按钮里面写了
          me.i_bar_change();
        },
        // --------------------------------------------模式选择
        i_bar_change: function(argument) {
          var me = this;
          $('body').on('click', '.mode_dom', function(e) {
            $(e.target).addClass('active').siblings().removeClass('active');
            var mode_id = $($(e.target)).attr('group');
            me.last_swicth_data({ item_id: me.item_ids, mode_id: mode_id });
          });
        },
        // ----------------------------------------------项目选择
        i_change: function() {
          var me = this;
          $('#select').unbind().on('click', function() {
            var str = '' +
              '<div class="ck_parent">' +
              '<p class="p_ck_item"><input type="checkbox" name="category" value="1" checked/> 第一项目</p>' +
              '<p class="p_ck_item"><input type="checkbox" name="category" value="2" /> 盛大集团</p>' +
              '<p class="p_ck_item"><input type="checkbox" name="category" value="3" /> 腾讯集团</p>' +
              '</div>';
            // 弹窗
            layer.open({
              type: 1,
              title: '选择项目',
              area: ['200px', '300px'],
              zIndex: 600,
              shadeClose: false, //点击遮罩关闭
              content: str,
              btn: ['确定', '取消'],
              success: function() {
                // 拿到记录的id数组
                // --------------------------反选设置
                var arr = me.item_ids.split(',');
                $('.p_ck_item input:checkbox').each(function(id, dom) {
                  for (var i = 0; i < arr.length; i++) {
                    if ($(dom).val() == arr[i]) {
                      $(dom).attr('checked', true);
                      break;
                    }
                  }
                });
              },
              yes: function(index, layero) {
                me.i_change_yes(index);
              },
              btn2: function(index, layero) {
                layer.close(index);
              }
            });
          });
        },
        // 选中的值的确认
        i_change_yes: function(index) {
          var me = this;
          var arr = [];

          $('.p_ck_item input:checkbox:checked').each(function(id, element) {
            arr.push($(element).val());
          });
          // 记录选择到的项目的Id组
          me.item_ids = arr.join(',');
          layer.close(index);

          // 每次默认都是选择聚合模式开始
          $('#dom_juhe').removeClass('active').addClass('active').siblings().removeClass('active');
          me.last_swicth_data({ item_id: me.item_ids, mode_id: 1 });
        },
        // ----------------------------------------------选择响应
        last_swicth_data: function(data) {
          var me = this;
          // ---------------------------------聚合模式
          if (data.mode_id == 1) {
            // 清除普通模式的定时器
            clearTimeout(me.pt_timer);
            clearTimeout(me.pt_t_timer);

            // -------------------------------防止在中间层点击项目名
            // 清除聚合模式的定时器
            clearTimeout(me.b_timer);
            clearTimeout(me.t_timer);

            // 清除各种返回按钮
            $('.back_btns').html('');

            // 省数据 选择一个项目，sheng_p就从新设置为空
            var all_data = { sheng_p: [], ret: 1 };

            // 省市区--监控数据
            var sheng_data = null;
            var shi_data = null;
            var qu_data = null;
            var moniter_data = null;

            var arr = data.item_id.split(',');
            arr.forEach(function(ele, index) {
              // 1
              if (ele == '1') {
                all_data.sheng_p.push({ "id": 1, "name": "项目1--省-点(可用)", "lng": 103.285261, "lat": 38.945698, "counts": 2, 'key': 'sheng' });
              }
              // 2
              else if (ele == '2') {
                all_data.sheng_p.push({ "id": 2, "name": "项目2--省-点", "lng": 106.285261, "lat": 36.945698, "counts": 2, 'key': 'sheng' });
              }
              // 3
              else if (ele == '3') {
                all_data.sheng_p.push({ "id": 3, "name": "项目3--省-点", "lng": 107.285261, "lat": 34.945698, "counts": 2, 'key': 'sheng' });
              }
            });

            // --市的数据
            shi_data = {
              shi_p: [
                { "id": 11, "name": "市--聚合点A", "lng": 119.285261, "lat": 39.945698, "counts": 2, 'key': 'shi' },
                { "id": 12, "name": "市--聚合点B", "lng": 117.35568, "lat": 34.564186, "counts": 2, 'key': 'shi' },
              ],
              ret: 1,
            };
            // --区的数据
            qu_data = {
              A: {
                qu_p: [
                  { "id": 111, "name": "区--聚合点A-1", "lng": 116.285261, "lat": 39.945698, "counts": 1, 'key': 'qu' },
                  { "id": 112, "name": "区--聚合点A-2", "lng": 116.826261, "lat": 39.386698, "counts": 1, 'key': 'qu' },
                ],
                ret: 1,
              },
              B: {
                qu_p: [
                  // { "id": 111, "name": "区--聚合点111", "lng": 116.285261, "lat": 39.945698, "counts": 1 },
                  { "id": 121, "name": "区--聚合点B-1", "lng": 116.286261, "lat": 39.946698, "counts": 1, 'key': 'qu' },
                  { "id": 122, "name": "区--聚合点B-2", "lng": 116.586261, "lat": 39.846698, "counts": 1, 'key': 'qu' },
                ],
                ret: 1,
              }
            };
            // --追踪数据
            moniter_data = {
              s111: {
                bikes: [
                  { "id": 41, "position": { "lng": 115.364384, "lat": 39.980178, }, sn: 45445454545 },
                ]
              },
              s112: {
                bikes: [
                  { "id": 42, "position": { "lng": 114.485422, "lat": 39.952183, }, sn: 111111111111 },
                ]
              },
              s121: {
                bikes: [
                  { "id": 43, "position": { "lng": 113.409551, "lat": 39.908896, }, sn: 2222222222222 },
                ]
              },
              s122: {
                bikes: [
                  { "id": 44, "position": { "lng": 116.409551, "lat": 39.908896, }, sn: 3333333333333 },
                ]
              },
            };

            me.sheng_data = all_data;
            me.shi_data = shi_data;
            me.qu_data = qu_data;
            me.moniter_data = moniter_data;

            me._juhe();
          }
          // ---------------------------------普通模式
          else if (data.mode_id == 0) {
            var pt_all_data = null
            var pt_one_data = null

            // ----------------清除普通模式的定时器
            clearTimeout(me.pt_timer);
            clearTimeout(me.pt_t_timer);

            // ----------------清除聚合模式的定时器
            clearTimeout(me.b_timer);
            clearTimeout(me.t_timer);
            // 清除各层的按钮
            $('.back_btns').html('');

            console.log('选择的项目为', data.item_id);

            pt_all_data = {
              bikes: [
                { "id": 41, "position": { "lng": 115.364384, "lat": 39.880178, }, sn: 45445454545 },
                { "id": 41, "position": { "lng": 119.364384, "lat": 36.280178, }, sn: 45445454545 },
                { "id": 41, "position": { "lng": 110.364384, "lat": 32.380178, }, sn: 45445454545 },
              ]
            };
            pt_one_data = { "id": 44, "position": { "lng": 119.409551, "lat": 36.908896, }, sn: 3333333333333 }
            me.pt_all_data = pt_all_data;
            me.pt_one_data = pt_one_data;

            me._puto();
          }
        },
      }
      for (k in fn) {
        me[k] = fn[k];
      };
    },
    // ------------------------------------------juhe初始化
    _juhe: function() {
      var me = this;
      //省的聚合点
      this.shen_p = null;
      //市的聚合点
      this.shi_p = null;
      //区的聚合点
      this.qu_p = null;
      //监控的点
      this.jk_p = null;

      //退出到省聚合模式的--按钮
      this.shen_outBtn = null;
      //退出到省聚合模式的--按钮
      this.shi_outBtn = null;
      //退出到省聚合模式的--按钮
      this.qu_outBtn = null;
      // 加载一次返回区按钮
      this.qu_out_key = true;

      //区进入的监控的计时器
      this.b_timer = null;
      //景区自行车的最佳视角
      this.b_view = true;

      //设备追踪
      // 退出追踪的返回按钮
      this.t_outBtn = null;
      //追踪的定时器
      this.t_timer = null;
      //追踪的marker容器
      this.t_container = null;






      // 全部数据聚合
      me.jh_ajax();
    },
    // ------------------------------------------puto初始化
    _puto: function() {
      /* body... */
      var me = this;
      //监控层的计时器
      this.pt_timer = null;
      //最佳视角
      this.pt_view = true;

      // 监控层被点击的点收集的
      this.pt_container = null;
      // 追踪的定时器
      this.pt_t_timer = null;

      me.pt_all();
    },
    // bind
    clus_bind: function() {
      var me = this;
      // -------------------------------------------------------------------------聚合模式
      var juhe = {
        //聚合数据全部
        jh_ajax: function() {
          var me = this;
          //景区模拟数据
          var data = me.sheng_data;
          me.jh_make(data.sheng_p);
        },

        //-------------------------------------------------------聚合打点
        jh_make: function(data) {
          var me = this;
          // 清除页面上所有的点和label
          me._clearOverlays();

          var geoPoints = [];
          data.forEach(function(item) {
            // var convertData = me.convertCoord({ 'lng': item.lng, 'lat': item.lat });
            var iconPath = '';
            if (item.key == 'sheng') {
              iconPath = "../images/sheng.jpg";
            } else if (item.key == 'shi') {
              iconPath = "../images/shi.jpg";
            } else if (item.key == 'qu') {
              iconPath = "../images/qu.jpg";
            }

            // 打marker
            var marker = new me.Gmap.Marker({
              position: {
                lat: item.lat,
                lng: item.lng
              },
              map: me.map,
              icon: iconPath,
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });
            // 打label
            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">名称：' + item.name +
              '<br />' +
              '<span class="" id="devReceive" >数量：' + item.counts + '</span>' +
              '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var label = me.jh_p_label(str);
            label.open(me.map, marker);
            marker.id = item.id;

            marker.addListener('click', function() {
              me.jh_p_click(marker);
            });

            // 收集点
            me.ceng_p_arr.push({ marker: marker, label: label });
            geoPoints.push(marker);
          });
          // 设置最优显示
          me._setVeiwPort(geoPoints);
        },
        // marker的信息框
        jh_p_label: function(argument) {
          var infoBubble2 = new InfoBox({
            content: argument,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-100, -90),
            zIndex: null,
            boxStyle: {
              background: "rgba(0,0,0,0.3)",
              // opacity: 0.75,
              width: "200px"
            },
            // closeBoxMargin: "10px 2px 2px 2px",
            // closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
          });
          return infoBubble2;
        },
        //------------------------------------------------------点击后的进入
        jh_p_click: function(marker) {
          var me = this;
          // 省聚合进入----观察市的聚合点
          if (me.shen_p == null) {
            me.shen_in(marker);
          }
          // 市聚合进入----观察区的聚合点
          else if (me.shi_p == null) {
            me.shi_in(marker);
          }
          // 区进入观察模式--实时监控观察模式
          else {
            me.qu_in(marker);
          }
        },

        // -----------------------------------点击省进入市
        shen_in: function(marker) {
          var me = this;
          me.shen_p = marker;
          // marker.id=1
          if (marker.id == 1) {
            var data = me.shi_data;
          }
          me.jh_make(data.shi_p);

          // 添加返回省按钮---(google地图默认一个位置只能添加一个控件，再次添加会使下一个控件向下移动。所有这里不能采用原生控件)
          // me.shen_outBtn = document.createElement('div');
          // new NewControl({
          //   p_dom: me.shen_outBtn,
          //   map: me.map,
          //   offset: ['10px', 0, 0, '412px'],
          //   btns: ['返回省shen']
          // }).init();
          // me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.shen_outBtn);

          // -----简单的页面上写一个
          var btn = '<div id="dom_sen" class = "_btns">返回省</div>'
          $('.back_btns').html(btn);

          // 添加返回省观察模式
          me.shen_out();
        },
        // 退出到省观察聚合模式
        shen_out: function() {
          var me = this;
          $('#dom_sen').unbind().on('click', function() {
            // 清除地图上所有的点
            me._clearOverlays();
            // // 移除按钮
            $('.back_btns').html('');
            // 聚合点标记重置
            me.shen_p = null;
            me.shi_p = null;
            me.qu_p = null;
            me.jh_ajax();
          });
        },

        // ------------------------------------点击市进入区
        shi_in: function(marker) {
          var me = this;
          // 市聚合点被记录
          me.shi_p = marker;
          // 移除--返回省--的按钮
          $('.back_btns').html('');

          // marker.id=11
          if (marker.id == 11) {
            // statement
            var data = me.qu_data.A;
          }
          // id=12
          else if (marker.id == 12) {
            var data = me.qu_data.B;
          }
          me.jh_make(data.qu_p);

          // 添加按钮
          var btn = '<div id="dom_shi" class = "_btns">返回市</div>'
          $('.back_btns').html(btn);
          // 返回到市
          me.shi_out();
        },
        // 退出到--市观察--聚合模式
        shi_out: function() {
          var me = this;

          $('#dom_shi').unbind().on('click', function() {
            // 清除地图上所有的点
            me._clearOverlays();
            // 移除按钮
            $('.back_btns').html('');
            // 市的标记点为空
            me.shi_p = null;
            // 知道从哪个省进入的市观察模式
            me.shen_in(me.shen_p);
          });
        },

        // 点击----------------------------------------------区进入监控
        qu_in: function(marker) {
          var me = this;
          // 市聚合点被记录
          me.qu_p = marker;
          // marker.id=111
          if (marker.id == 111) {
            data = me.moniter_data.s111;
          }
          // marker.id=112
          else if (marker.id == 112) {
            data = me.moniter_data.s112;
          }
          // marker.id=121
          else if (marker.id == 121) {
            data = me.moniter_data.s121;
          }
          // marker.id=122
          else if (marker.id == 122) {
            data = me.moniter_data.s122;
          }

          data.bikes.forEach(function(item) {
            item.position.lng = item.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
            item.position.lat = item.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
          });

          me.sn_make(data.bikes);
          me.b_view = false;

          me.b_timer = setTimeout(function() {
            console.log('区的监控~~')
            me.qu_in(marker);
          }, 2000);


          // 退出到区（加载一次）
          if (me.qu_out_key) {
            me.qu_out_key = false;
            // 移除--返回市--的按钮
            $('.back_btns').html('');
            // 添加按钮
            var btn = '<div id="dom_quu" class = "_btns">返回区</div>'
            $('.back_btns').html(btn);

            me.qu_out();
          }
        },
        qu_out: function() {
          var me = this;

          $('#dom_quu').unbind().on('click', function() {
            // 清除地图上所有的点
            me._clearOverlays();
            clearTimeout(me.b_timer);
            // 移除按钮
            $('.back_btns').html('');

            // 区的标记点为空
            me.qu_p = null;
            // 监控最优视角
            me.b_view = true;
            // 加载一次退出到区的按钮设置
            me.qu_out_key = true;

            // 知道从哪个shi进入的市观察模式
            me.shi_in(me.shi_p);
          });
        },

        //-------------------------------------监控层的数据生成
        sn_make: function(data) {
          var me = this;

          me._clearOverlays();
          var geoPoints = [];

          data.forEach(function(item) {
            // var convertData = me.convertCoord({ 'lng': item.position.lng, 'lat': item.position.lat });
            // 打marker
            var iconPath = "../images/car_online.png";
            var marker = new me.Gmap.Marker({
              position: {
                lat: item.position.lat,
                lng: item.position.lng
              },
              map: me.map,
              icon: iconPath,
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });

            // 打label
            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">设备号' + item.sn +
              '<br />' +
              // '<span class="" id="devReceive" >数量：' + item.counts + '</span>' +
              // '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var label = me.jh_p_label(str);
            label.open(me.map, marker);
            marker.id = item.id;

            // 绑定点击属性
            marker.addListener('click', function(event) {

              var event = event || window.event;
              if (event && event.stopPropagation) {
                event.stopPropagation();
              } else {
                event.cancelBubble = true;
              };

              // 清除--监控层--定时器
              clearTimeout(me.b_timer);
              me._clearOverlays();

              // 按钮的设置
              $('.back_btns').html('');
              var btn = '<div id="dom_tui" class = "_btns">退出追踪</div>'
              $('.back_btns').html(btn);
              me.t_out();

              // 开启追踪
              me.sn_trail(marker);
            });

            // 监控层数据收集
            me.jk_p_arr.push({ marker: marker, label: label });
            geoPoints.push(marker);
          });
          if (me.b_view) {
            me._setVeiwPort(geoPoints);
          }
        },
        //设备追踪
        sn_trail: function(marker) {

          if (marker.id == 41) {
            data = me.moniter_data.s111.bikes[0];
          } else if (marker.id == 42) {
            data = me.moniter_data.s112.bikes[0];
          } else if (marker.id == 43) {
            data = me.moniter_data.s121.bikes[0];
          } else if (marker.id == 44) {
            data = me.moniter_data.s122.bikes[0];
          }
          data.position.lng = data.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
          data.position.lat = data.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;

          me.sn_trail_draw(data);
          me.t_timer = setTimeout(function() {
            console.log('追踪开始');
            me.sn_trail(marker);
          }, 2000)
        },
        //-------------------------------------追踪层的的数据生成
        sn_trail_draw: function(item) {
          var me = this;
          var geoPoints = [];
          // 第一次打marker
          if (me.t_container == null) {

            // var convertData = me.convertCoord({ 'lng': item.position.lng, 'lat': item.position.lat });
            var iconPath = "../images/car_online.png";
            var marker = new me.Gmap.Marker({
              position: {
                lat: item.position.lat,
                lng: item.position.lng
              },
              map: me.map,
              icon: iconPath,
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });

            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">设备号' + item.sn +
              '<br />' +
              // '<span class="" id="devReceive" >数量：' + item.counts + '</span>' +
              // '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var label = me.jh_p_label(str);
            label.open(me.map, marker);
            marker.id = item.id;

            // 收集marker
            me.t_container = marker;
            geoPoints.push(marker);
            // 这个收集第一次
            me.trail_p_arr.push({ marker: marker, label: label });
          }
          // 第二次移动点
          else {

            var newPoint = new google.maps.LatLng(item.position.lat, item.position.lng);
            var oldPoint = me.t_container.getPosition();
            var line = me.sn_t_line([oldPoint, newPoint]);
            // 收集线
            me.trail_line_arr.push({ marker: line });
            // 移动到新的点上
            me.t_container.setPosition(newPoint);
            geoPoints.push(me.t_container);
          }
          me._setVeiwPort(geoPoints);
        },
        //追踪的线
        sn_t_line: function(points) {
          var me = this;
          var flightPath = new me.Gmap.Polyline({
            path: points,
            geodesic: true,
            strokeColor: '#21536d',
            strokeOpacity: 0.8,
            strokeWeight: 4
          });
          flightPath.setMap(me.map);
          return flightPath;
        },
        //退出到监控层
        t_out: function() {
          var me = this;
          $('#dom_tui').unbind().on('click', function() {
            /* body... */
            me._clearOverlays();
            // 清除所有按钮
            $('.back_btns').html('');
            // 清除追踪定时器
            clearTimeout(me.t_timer);

            me.t_container = null;
            // 从qu的进入监控层，加载一次按钮（返回区按钮）
            me.qu_out_key = true;
            me.qu_in(me.qu_p);
          })
        },
      };
      for (k in juhe) {
        me[k] = juhe[k];
      };
      // --------------------------------------------------------------------------普通模式
      var puto = {
        // 点击区进入监控
        pt_all: function() {

          data = me.pt_all_data
          data.bikes.forEach(function(item) {
            item.position.lng = item.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
            item.position.lat = item.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
          });

          me.pt_sn_make(data.bikes);
          me.pt_view = false;

          me.pt_timer = setTimeout(function() {
            console.log('pt的监控层')
            me.pt_all();
          }, 2000);
        },
        //设备打点
        pt_sn_make: function(data) {
          var me = this;

          me._clearOverlays();
          var geoPoints = [];

          data.forEach(function(item) {
            // var convertData = me.convertCoord({ 'lng': item.position.lng, 'lat': item.position.lat });
            // 打marker
            var iconPath = "../images/car_online.png";
            var marker = new me.Gmap.Marker({
              position: {
                lat: item.position.lat,
                lng: item.position.lng
              },
              map: me.map,
              icon: iconPath,
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });

            // 打label
            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">设备号' + item.sn +
              '<br />' +
              // '<span class="" id="devReceive" >数量：' + item.counts + '</span>' +
              // '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var label = me.pt_p_label(str);
            label.open(me.map, marker);
            marker.id = item.id;

            // 绑定点击属性
            marker.addListener('click', function(event) {

              var event = event || window.event;
              if (event && event.stopPropagation) {
                event.stopPropagation();
              } else {
                event.cancelBubble = true;
              };

              // 清除--监控层--定时器
              clearTimeout(me.pt_timer);
              me._clearOverlays();

              // 按钮的设置
              $('.back_btns').html('');
              var btn = '<div id="dom_ptt" class = "_btns">退出追踪</div>'
              $('.back_btns').html(btn);

              me.pt_t_out();

              // 开启追踪
              me.pt_sn_trail(marker);
            });

            // 监控层数据收集
            me.pt_jk_p_arr.push({ marker: marker, label: label });
            geoPoints.push(marker);
          });
          if (me.b_view) {
            me._setVeiwPort(geoPoints);
          }
        },
        // pt的label
        pt_p_label: function(argument) {
          /* body... */
          var infoBubble2 = new InfoBox({
            content: argument,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-100, -90),
            zIndex: null,
            boxStyle: {
              background: "rgba(0,0,0,0.3)",
              // opacity: 0.75,
              width: "200px"
            },
            // closeBoxMargin: "10px 2px 2px 2px",
            // closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
          });
          return infoBubble2;
        },
        //设备追踪
        pt_sn_trail: function(marker) {

          // data = me.pt_one_data;
          data = { "id": 44, "position": { "lng": 117.409551, "lat": 36.908896, }, sn: 3333333333333 };
          data.position.lng = data.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
          data.position.lat = data.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;

          me.pt_sn_trail_draw(data);
          me.pt_t_timer = setTimeout(function() {
            console.log('pt追踪开始');
            me.pt_sn_trail(marker);
          }, 2000)
        },
        // 具体追踪划线生成
        pt_sn_trail_draw: function(item) {
          var me = this;
          var geoPoints = [];
          // 第一次打marker
          if (me.pt_container == null) {

            // var convertData = me.convertCoord({ 'lng': item.position.lng, 'lat': item.position.lat });
            var iconPath = "../images/car_online.png";
            var marker = new me.Gmap.Marker({
              position: {
                lat: item.position.lat,
                lng: item.position.lng
              },
              map: me.map,
              icon: iconPath,
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });

            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">设备号' + item.sn +
              '<br />' +
              // '<span class="" id="devReceive" >数量：' + item.counts + '</span>' +
              // '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var label = me.pt_p_label(str);
            label.open(me.map, marker);
            marker.id = item.id;

            // 收集marker
            me.pt_container = marker;
            geoPoints.push(marker);
            // 这个收集第一次
            me.pt_trail_p_arr.push({ marker: marker, label: label });
          }
          // 第二次移动点
          else {
            var newPoint = new google.maps.LatLng(item.position.lat, item.position.lng);
            var oldPoint = me.pt_container.getPosition();
            var line = me.pt_sn_t_line([oldPoint, newPoint]);
            // 收集线
            me.pt_trail_line_arr.push({ marker: line });
            // 移动到新的点上
            me.pt_container.setPosition(newPoint);
            geoPoints.push(me.pt_container);
          }
          me._setVeiwPort(geoPoints);
        },
        //追踪的线
        pt_sn_t_line: function(points) {
          var me = this;
          var flightPath = new me.Gmap.Polyline({
            path: points,
            geodesic: true,
            strokeColor: '#21536d',
            strokeOpacity: 0.8,
            strokeWeight: 4
          });
          flightPath.setMap(me.map);
          return flightPath;
        },
        //退出到区检测
        pt_t_out: function() {
          var me = this;
          // 去除按钮
          $('#dom_ptt').unbind().on('click', function() {
            me._clearOverlays();
            // 清除所有按钮
            $('.back_btns').html('');
            // 清除追踪定时器
            clearTimeout(me.pt_t_timer);

            me.pt_container = null;
            // 从qu的进入监控层，加载一次按钮（返回区按钮）
            me.pt_view = true;
            me.pt_all();
          })
        },
      };
      for (key in puto) {
        me[key] = puto[key];
      };
    },

    // 清除页面上所有的marker
    _clearOverlays: function(argument) {
      // body... 
      var me = this;
      // ------------------------------------聚合模式的清除
      // 清除各层点
      me._all_pt_clear(me.ceng_p_arr);
      me.ceng_p_arr = [];

      // 清除监控层的点数据
      me._all_pt_clear(me.jk_p_arr);
      me.jk_p_arr = [];


      // 清除追踪层的点数据
      me._all_pt_clear(me.trail_p_arr);
      me.trail_p_arr = [];

      // 清除追踪层线的数据
      me._all_pt_clear(me.trail_line_arr);
      me.trail_line_arr = [];

      // ------------------------------------普通模式的清除
      me._all_pt_clear(me.pt_jk_p_arr);
      me.pt_jk_p_arr = [];

      // 被点击追踪点的清除
      me._all_pt_clear(me.pt_trail_p_arr);
      me.pt_trail_p_arr = [];

      // 清除追踪层线的数据
      me._all_pt_clear(me.pt_trail_line_arr);
      me.pt_trail_line_arr = [];
    },
    // 清除数据和label
    _all_pt_clear: function(arr) {
      /* body... */
      var me = this;
      // 清除数据，容器重置
      if (arr.length != 0) {
        for (var i = 0; i < arr.length; i++) {

          if (arr[i].marker != undefined) {
            // 清除点
            arr[i].marker.setMap(null);
          }
          if (arr[i].label != undefined) {
            // 清除信息框
            arr[i].label.close();
          }
        };
      }
    },
    // 最优显示marker
    _setVeiwPort: function(arr) {
      /* body... */
      var me = this;
      var bounds = new me.Gmap.LatLngBounds();
      //读取标注点的位置坐标，加入LatLngBounds  
      for (var i = 0; i < arr.length; i++) {
        bounds.extend(arr[i].getPosition());
      }
      //调整map，使其适应LatLngBounds,实现展示最佳视野的功能
      me.map.fitBounds(bounds);
    },
  };
  window["diyGMap"] = diyGMap;
})(jQuery, window);
