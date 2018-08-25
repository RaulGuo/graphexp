function initByAppName(){
    var app_name = "byPhoneIpLpa"
    var server_url = "http://localhost:8080/risk-graph-web/gremlin/initByAppName?appName="+app_name;
    $.ajax({
        type: "GET",
        accept: "application/json",
        contentType:"application/json; charset=utf-8",
        url: server_url,
        //headers: GRAPH_DATABASE_AUTH,
        timeout: REST_TIMEOUT,
        success: function (data, textStatus, jqXHR) {
            console.log(data)
            var result = data.result;
            //console.log(result)
        },
        error: function (result, status, error) {
            console.log("Connection failed. " + status);
        }
    });
}

var riskGraph = (function() {
    var _font_size = "12px";
    var table_Graphinfo = {}

    function clickVertexQuery(vtx) {
        let app_name = $('#app_name').val();
        // var app_name = "byPhoneIpLpa"
        var vtxId = vtx.id

        let server_address = $('#server_address').val();
        let server_port = ":"+$('#server_port').val();

        // var server_url = "http://"+server_address+server_port+"/risk-graph-web/gremlin/clickQuery"
        var server_url = "http://localhost:8080/risk-graph-web/gremlin/clickQuery"
        var edge_filter_field = $('#edge_filter').val();
        $.ajax({
            type: "GET",
            accept: "application/json",
            contentType: "application/json; charset=utf-8",
            url: server_url,
            //headers: GRAPH_DATABASE_AUTH,
            data: {
                "appName": app_name,
                "vtxId": vtxId,
                "edgeLabel": edge_filter_field
            },
            timeout: REST_TIMEOUT,
            success: function (data, textStatus, jqXHR) {
                console.log(data)
                var graph = graphioGremlin.arrange_datav3(data);
                graph_viz.refresh_data(graph, 0, vtxId);
                //console.log(result)
            },
            error: function (result, status, error) {
                console.log("Connection failed. " + status);

            }
        });
    }

    function searchQuery() {
        let app_name = $('#app_name').val();
        let property_value = $('#search_value').val();
        let property = $('#search_field').val();
        let label = $('#label_field').val();
        let limit = $('#limit_field').val();
        // let search_type = $('#search_type').val();

        let server_address = $('#server_address').val();
        let server_port = ":"+$('#server_port').val();

        var server_url = "http://localhost:8080/risk-graph-web/gremlin/searchQuery"
        // var server_url = "http://"+server_address+server_port+"/risk-graph-web/gremlin/searchQuery"

        var edge_filter_field = $('#edge_filter').val();
        $.ajax({
            type: "GET",
            accept: "application/json",
            contentType: "application/json; charset=utf-8",
            url: server_url,
            //headers: GRAPH_DATABASE_AUTH,
            data: {
                "appName": app_name,
                "label": label,
                "property": property,
                "propValue": property_value,
                "limit": limit,
                "edgeLabel": edge_filter_field
            },
            timeout: REST_TIMEOUT,
            success: function (data, textStatus, jqXHR) {
                console.log(data)
                var graph = graphioGremlin.arrange_datav3(data);
                graph_viz.refresh_data(graph, 1, null);
                //console.log(result)
            },
            error: function (result, status, error) {
                console.log("Connection failed. " + status);
            }
        });
    }

    function getGraphBaseInfo(){
        let app_name = $('#app_name').val();
        let server_address = $('#server_address').val();
        let server_port = ":"+$('#server_port').val();

        var server_url = "http://localhost:8080/risk-graph-web/gremlin/getGraphInfo?appName="+app_name
        // var server_url = "http://"+server_address+server_port+"/risk-graph-web/gremlin/getGraphInfo?appName="+app_name

        $.ajax({
            type: "GET",
            accept: "application/json",
            contentType: "application/json; charset=utf-8",
            url: server_url,
            timeout: REST_TIMEOUT,
            success: function (data, textStatus, jqXHR) {
                console.log(data)
                displayGraphInfo(data)
                // graph_viz.refresh_data(graph, 1, null);
                //console.log(result)
            },
            error: function (result, status, error) {
                console.log("Connection failed. " + status);
            }
        });


    }


    function displayGraphInfo(data){
        var _node_properties = data[0]
        var _edge_properties = data[1]
        var _vtx_group_count = data[2]
        var _edge_group_count = data[3]

        //展示顶点和边的属性
        display_properties_bar(_node_properties,'nodes','显示顶点属性：');
        display_properties_bar(_edge_properties,'edges','显示边属性：');
        // 展示顶点颜色的设置
        display_color_choice(_node_properties,'nodes','顶点着色：');

        // var table_Graphinfo = $('#tableGraph')
        table_Graphinfo = d3.select('#graphInfo')
        table_Graphinfo.select("tbody").remove();
        var info_table = table_Graphinfo.append("tbody");
        append_keysvalues(info_table,{"顶点label":""},"bold");
        append_keysvalues(info_table,_vtx_group_count,"normal");

        append_keysvalues(info_table,{"边label":""},"bold");
        append_keysvalues(info_table,_edge_group_count,"normal");
    }


    function append_keysvalues(table_body,data,type){
        for (var key in data){
            var info_row = table_body.append("tr");
            var key_text = info_row.append("td").text(key).style("font-size",_font_size);
            var value_text = info_row.append("td").text(data[key]).style("font-size",_font_size);
            if (type=="bold") {
                key_text.style('font-weight','bolder');}
        }
    }

    return {
        clickVertexQuery: clickVertexQuery,
        searchQuery : searchQuery,
        getGraphBaseInfo : getGraphBaseInfo
    }
})();

// function search(gremlin_query, server_url, query_type, active_node, message, callback) {
//     let input_string = $('#search_value').val();
//     let input_field = $('#search_field').val();
//     let label_field = $('#label_field').val();
//     let limit_field = $('#limit_field').val();
//     let app_name = "byPhoneIpLpa"
//
//     // let server_address = $('#server_address').val();
//     // let server_port = $('#server_port').val();
//     // let server_url = "http://"+server_address+":"+server_port+"/risk-graph-web";
//     let server_url = "http://localhost:8080/risk-graph-web/gremlin/initByAppName?appName="+app_name;
//
//     // Get the data from the server
//     $.ajax({
//         type: "POST",
//         accept: "application/json",
//         //contentType:"application/json; charset=utf-8",
//         url: server_url,
//         //headers: GRAPH_DATABASE_AUTH,
//         timeout: REST_TIMEOUT,
//         data: JSON.stringify({"gremlin": gremlin_query}),
//         success: function (data, textStatus, jqXHR) {
//             var Data = data.result.data;
//             //console.log(Data)
//             if (callback) {
//                 callback(Data);
//             } else {
//                 handle_server_answer(Data, query_type, active_node, message);
//             }
//         },
//         error: function (result, status, error) {
//             console.log("Connection failed. " + status);
//
//             // This will hold all error messages, to be printed in the
//             // output area.
//             let msgs = [];
//
//             if (query_type == 'editGraph') {
//                 msgs.push('Problem accessing the database using REST at ' + server_url);
//                 msgs.push('Message: ' + status + ', ' + error);
//                 msgs.push('Possible cause: creating an edge with bad node ids ' +
//                     '(linking nodes not existing in the DB).');
//             } else {
//                 msgs.push('Can\'t access database using REST at ' + server_url);
//                 msgs.push('Message: ' + status + ', ' + error);
//                 msgs.push('Check the server configuration ' +
//                     'or try increasing the REST_TIMEOUT value in the config file.');
//             }
//
//             // If a MalformedQueryException is received, user might be
//             // trying to reach an Amazon Neptune DB. Point them to the
//             // config file as a probable cause.
//             if (result.status === 400
//                 && SINGLE_COMMANDS_AND_NO_VARS === false
//                 && result.hasOwnProperty('responseJSON')
//                 && result.responseJSON.code === 'MalformedQueryException') {
//                 msgs.push('If connecting to an Amazon Neptune databse, ensure that ' +
//                     'SINGLE_COMMANDS_AND_NO_VARS is set to true in the config file.');
//             }
//
//             $('#outputArea').html(msgs.map(function (i) {
//                 return '<p>' + i + '</p>'
//             }).join(''));
//             $('#messageArea').html('');
//         }
//     });
// }