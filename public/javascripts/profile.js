/**
 * New node file
 */
$(document).ready(function () {
//     alert("hi");
    $( "#company1" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/company',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#cid1").val(i.item.val);
            },
            minLength: 1
    });
    
    $( "#position1" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/position',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#pid1").val(i.item.val);
            },
            minLength: 1
    });
    $( "#company2" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/company',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#cid2").val(i.item.val);
            },
            minLength: 1
    });
    
    $( "#position2" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/position',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#pid2").val(i.item.val);
            },
            minLength: 1
    });
    $( "#company3" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/company',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#cid3").val(i.item.val);
            },
            minLength: 1
    });
    
    $( "#position3" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/position',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#pid3").val(i.item.val);
            },
            minLength: 1
    });
    $( "#company4" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/company',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#cid4").val(i.item.val);
            },
            minLength: 1
    });
    
    $( "#position4" ).autocomplete({
        source: function (request, response) {
                $.ajax({
                    url: '/staticId/position',
                    data: '{ "term":"' + request.term + '"}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                        response($.map(data.result, function (item) {
                             //alert("data "+item.value);
                            return {
                                label: item.name,
                                val: item.id
                            }
                        }))
                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            },
            select: function (e, i) {
                $("#pid4").val(i.item.val);
            },
            minLength: 1
    });




});