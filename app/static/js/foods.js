new Vue({

    el: '#app',

    data: {
        upload_img_url: '',
        search_keyword: '',
        del_check_visible: false,
        dlg_foods_img_upload_show: false,
        dialogFormVisible: false,
        food_images_list: [],
        formLabelWidth: '150px',
        dlg_title: '应用信息',
        form: {},
        delItem: {},//要被删除的
        apiUrl: '/api/v1.0/food',
        apiSource: 'api/v1.0/source',
        items: [{'sql_id': 1}],
        len: 0,
        unit_options: [{ //单位选项
            value: '份',
            label: '份'
        }, {
            value: '瓶',
            label: '瓶'
        }],
    },
    mounted: function () {
        this.getFoods();
    },


    methods: {

        //图片上传
        onCrateImgDlg: function (row) {

            var vm = this;
            vm.dlg_foods_img_upload_show = true;
            console.log(row.sha_id);
            this.upload_img_url = '/api/v1.0/upload/' + row.sha_id;
            console.log(row.images);
            this.food_images_list = row.images;
        },

        CloseDlg_img_upload: function () {

            this.dlg_foods_img_upload_show = false;
        },

        handleSuccess: function(response, file, fileList){
             this.getFoods(); //重新获取数据
            console.log(response);
             console.log(file.name);
             file.name = response.value;
        },
        handleRemove: function (file, fileList) {
            //console.log(file, fileList);
            console.log(file.name);
            console.log(fileList);

            this.delImg(file.name);


        },
        handlePreview: function (file) {
            console.log(file);
        },

        delImg: function (img_sha_id) {
            var vm = this;
            console.log('删除图片');
            $request.del(this.apiSource + '/' + img_sha_id, null, function (data) {
                console.log(data);
                vm.$message(data.msg);
                vm.getFoods(); //重新获取数据
            }, function (error_data) {
                console.log(error_data);
                vm.$message.error(error_data.msg.substring(0, 120));
            })
        },


        //

        dlgOk: function (form) {
            var vm = this;
            console.log(form.app_id);
            var temp = {};
            temp.title = form.title;
            temp.food_index = form.food_index;
            temp.description = form.description;
            temp.total_num = form.total_num;
            temp.unit = form.unit;
            temp.discount_price = form.discount_price;
            temp.price = form.price;

            if (form.edit == 'add') {

                console.log('添加');
                $request.post(this.apiUrl, temp, function (data) {
                    var json_target = new JSONFormat(JSON.stringify(data), 4).toString();
                    console.log(json_target);
                    vm.getFoods(); //重新获取数据
                    vm.$message('添加成功');
                    vm.dialogFormVisible = false;

                }, function (error_data) {
                    var json_target = new JSONFormat(JSON.stringify(error_data), 4).toString();
                    vm.$message.error(error_data.msg.substring(0, 120));
                });

            } else if (form.edit == 'modify') {
                temp.sha_id = form.sha_id;
                console.log('修改');
                console.log(temp.sha_id);
                $request.put(this.apiUrl + '/' + temp.sha_id, temp, function (data) {
                    var json_target = new JSONFormat(JSON.stringify(data), 4).toString();
                    console.log(json_target);
                    vm.getFoods(); //重新获取数据
                    vm.$message('修改成功');
                    vm.dialogFormVisible = false;

                }, function (error_data) {
                    var json_target = new JSONFormat(JSON.stringify(error_data), 4).toString();
                    vm.$message.error(error_data.msg.substring(0, 120));
                });
            }

        }
        ,

        switchChange: function (row) {
            console.log(row.states);

            if (row.states == 1) {
                row.states = 0;
            } else {
                row.states = 1;
            }

            this.updateStates(row.sha_id, row.states);
        },

        onCreateDialog: function () {
            //创建新app信息
            this.dialogFormVisible = true;
            this.form = {
                ok: '添加',
                edit: 'add',
                food_index: 100
            };
        }
        ,
        showCheckDel: function (item) {
            this.del_check_visible = true;
            this.delItem = item;
        }
        ,
        onEdit: function (form) { //编辑
            this.dialogFormVisible = true;
            console.log(form);
            this.form.sha_id = form.sha_id;
            this.form.title = form.title;
            this.form.food_index = form.food_index;
            this.form.description = form.description;
            this.form.total_num = form.total_num;
            this.form.unit = form.unit;
            this.form.discount_price = form.discount_price;
            this.form.price = form.price;

            this.form.ok = '修改';
            this.form.edit = 'modify';


        }
        ,

        onDel: function () {
            var vm = this;
            console.log(this.delItem.sha_id);
            vm.del_check_visible = false;
            console.log('删除');
            $request.del(this.apiUrl + '/' + this.delItem.sha_id, null, function (data) {
                console.log(data);
                vm.$message(data.msg);
                vm.getFoods(); //重新获取数据
            }, function (error_data) {
                console.log(error_data);
                vm.$message.error(error_data.msg.substring(0, 120));
            })
        },

        updateStates: function (sha_id, state) {
            //更新状态

            var vm = this;
            $request.get(vm.apiUrl + '/' + sha_id + '/' + state, null, function (data) {
                vm.$message(data.msg);

            }, function (error_data) {
                vm.$message.error(error_data.msg.substring(0, 120));
            })

        },

        getFoods: function () {
            var vm = this;
            $request.get(vm.apiUrl, null, function (data) {

                vm.len = data.value.length;
                console.log(data.value);
                // var _apps = new Array();
                //  var apps = data.value.apps;
                // for (index in apps) {
                //     //console.log(index)
                //     //   console.log(data.value[index].app_name)
                //     var temp = {};
                //     temp.id = apps[index].id;
                //
                //     temp.app_name = apps[index].app_name;
                //     temp.value = apps[index].app_name;
                //     temp.app_sql_url = '<a href="/app-sql/' + apps[index].app_id + '">' + apps[index].app_name + '</a>';
                //     temp.app_id = apps[index].app_id;
                //     temp.test_appid = apps[index].test_appid;
                //     temp.app_secretkey = apps[index].app_secretkey;
                //     temp.test_secretkey = apps[index].test_secretkey;
                //     _apps.push(temp);
                // }
                //
                // console.log(_apps);
                // vm.items = _apps;

                vm.items = data.value;

                return vm.items;
            }, function (error_data) {
                console.log(error_data);
            })
        }


    }

})