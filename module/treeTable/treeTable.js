/**
 * 树形表格 2.x
 * date:2019-11-08   License By https://easyweb.vip
 */
layui.define(["layer", "laytpl", "form"], function (x) {
    var e = layui.jquery;
    var w = layui.layer;
    var c = layui.laytpl;
    var b = layui.form;
    var r = layui.device();
    var i = "treeTable";
    layui.link(layui.cache.base + "treeTable/treeTable.css");
    var s = function (z) {
        var y = {
            elem: undefined,
            data: [],
            cols: [],
            reqData: undefined,
            width: undefined,
            height: undefined,
            cellMinWidth: 100,
            skin: undefined,
            size: undefined,
            even: undefined,
            style: undefined,
            getThead: function () {
                return f(this)
            },
            getAllChooseBox: function () {
                return j(this)
            },
            getColgroup: function () {
                return g(this)
            },
            getTbWidth: function () {
                return m(this)
            },
            tree: {},
            text: {}
        };
        var D = {
            idName: "id",
            pidName: "pid",
            childName: "children",
            haveChildName: "haveChild",
            openName: "open",
            isPidData: false,
            iconIndex: 0,
            arrowType: undefined,
            onlyIconControl: false,
            getIcon: function (E) {
                return h(E, this)
            }
        };
        var C = {none: '<div style="padding: 15px 0;">暂无数据</div>'};
        this.options = e.extend(y, z);
        this.options.tree = e.extend(D, z.tree);
        this.options.text = e.extend(C, z.text);
        for (var B = 0; B < z.cols.length; B++) {
            var A = {
                field: undefined,
                title: undefined,
                align: undefined,
                templet: undefined,
                toolbar: undefined,
                width: undefined,
                type: undefined,
                style: undefined,
                fixed: undefined,
                unresize: false
            };
            this.options.cols[B] = e.extend(A, z.cols[B])
        }
        this.init();
        this.bindEvents()
    };
    s.prototype.init = function () {
        var O = this.options;
        var F = O.elem.substring(1);
        var z = e(O.elem);
        z.removeAttr("lay-filter");
        z.next(".ew-tree-table").remove();
        var B = '<div class="layui-form ew-tree-table" style="' + (O.style || "") + '">';
        B += '      <div class="ew-tree-table-group">';
        B += '         <div class="ew-tree-table-head">';
        B += '            <div class="ew-tree-table-border bottom"></div>';
        B += '            <table class="layui-table"></table>';
        B += "         </div>";
        B += '         <div class="ew-tree-table-box">';
        B += '            <table class="layui-table"></table>';
        B += '            <div class="ew-tree-table-loading"><i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop">&#xe63d;</i></div>';
        B += '            <div class="ew-tree-table-empty" style="display: none;">' + (O.text.none || "") + "</div>";
        B += "         </div>";
        B += "      </div>";
        B += '      <div class="ew-tree-table-border top"></div>';
        B += '      <div class="ew-tree-table-border left"></div>';
        B += '      <div class="ew-tree-table-border right"></div>';
        B += '      <div class="ew-tree-table-border bottom"></div>';
        B += "   </div>";
        z.after(B);
        var E = this.getComponents();
        var G = E.$view;
        G.attr("lay-filter", F);
        var J = E.$group;
        var K = E.$tbBox;
        var L = E.$table;
        var H = E.$headTb;
        var I = E.$tbEmpty;
        var A = E.$tbLoading;
        if (O.tree.isPidData) {
            a.pidToChildren(O.data, O.tree.idName, O.tree.pidName, O.tree.childName)
        } else {
            v(O.data, O.tree)
        }
        O.width && G.css("width", O.width);
        O.skin && L.attr("lay-skin", O.skin);
        O.size && L.attr("lay-size", O.size);
        O.even && L.attr("lay-even", O.even);
        if (r.ie) {
            G.find(".ew-tree-table-border.bottom").css("height", "1px");
            G.find(".ew-tree-table-border.right").css("width", "1px")
        }
        var M = O.getTbWidth();
        K.css("min-width", M.minWidth);
        H.parent().css("min-width", M.minWidth);
        if (M.setWidth) {
            K.css("width", M.width);
            H.parent().css("width", M.width)
        }
        var D = O.getColgroup();
        var N = D + "<thead>" + O.getThead() + "</thead>";
        if (O.height) {
            L.html(D + "<tbody></tbody>");
            H.html(N);
            L.css("margin-top", "-1px");
            if (O.height.indexOf("full-") == 0) {
                var C = parseFloat(O.height.substring(5));
                var y = "<style>.ew-tree-table > .ew-tree-table-group > .ew-tree-table-box {";
                y += "      height: " + (o() - C) + "px;";
                y += "      height: -moz-calc(100vh - " + C + "px);";
                y += "      height: -webkit-calc(100vh - " + C + "px);";
                y += "      height: calc(100vh - " + C + "px);";
                y += "   }</style>";
                K.after(y);
                K.attr("ew-tree-full", C)
            } else {
                K.css("height", O.height)
            }
        } else {
            L.html(N + "<tbody></tbody>")
        }
        b.render("checkbox", F);
        if (O.reqData) {
            this.renderBodyAsync()
        } else {
            if (O.data && O.data.length > 0) {
                L.children("tbody").html(this.renderBody(O.data));
                A.hide();
                this.renderNumberCol();
                b.render(null, F);
                this.checkChooseAllCB();
                d(G)
            } else {
                A.hide();
                I.show()
            }
        }
    };
    s.prototype.bindEvents = function () {
        var A = this;
        var J = this.options;
        var z = this.getComponents();
        var C = z.$view;
        var I = z.$table;
        var F = z.$tbEmpty;
        var B = z.tbFilter;
        var E = z.checkboxFilter;
        var H = z.radioFilter;
        var G = z.cbAllFilter;
        var y = I.children("tbody");
        var D = function (K) {
            var L = e(this);
            if (!L.is("tr")) {
                L = L.parentsUntil("tr[data-id]").parent()
            }
            var O = L.data("id");
            var M = q(J.data, O, J.tree);
            var N = {
                tr: L, data: M, del: function () {
                    var P = parseInt(this.tr.data("indent"));
                    this.tr.nextAll("tr").each(function () {
                        if (parseInt(e(this).data("indent")) <= P) {
                            return false
                        }
                        e(this).remove()
                    });
                    var Q = this.tr.prevAll("tr");
                    this.tr.remove();
                    t(J.data, O, J.tree);
                    if (!J.data || J.data.length <= 0) {
                        F.show()
                    }
                    A.renderNumberCol();
                    Q.each(function () {
                        var R = parseInt(e(this).data("indent"));
                        if (R < P) {
                            A.checkParentCB(e(this));
                            P = R
                        }
                    });
                    A.checkChooseAllCB()
                }, update: function (Q) {
                    M = e.extend(M, Q);
                    var P = parseInt(this.tr.data("indent"));
                    A.renderBodyTr(M, P, undefined, this.tr);
                    b.render(null, B);
                    A.checkIndeterminateCB();
                    A.checkChooseAllCB()
                }
            };
            return e.extend(N, K)
        };
        y.off("click.fold").on("click.fold", ".ew-tree-pack", function (O) {
            layui.stope(O);
            var M = e(this).parent().parent();
            if (M.hasClass("ew-tree-table-loading")) {
                return
            }
            var K = M.data("have-child");
            if (K != true && K != "true") {
                return
            }
            var P = M.data("id");
            var L = M.hasClass("ew-tree-table-open");
            var N = q(J.data, P, J.tree);
            if (!L && (!N[J.tree.childName] || N[J.tree.childName].length <= 0)) {
                A.renderBodyAsync(N, M)
            } else {
                l(M)
            }
        });
        y.off("click.tool").on("click.tool", "*[lay-event]", function (L) {
            layui.stope(L);
            var K = e(this);
            layui.event.call(this, i, "tool(" + B + ")", D.call(this, {event: K.attr("lay-event")}))
        });
        b.on("radio(" + H + ")", function (K) {
            var L = q(J.data, K.value, J.tree);
            A.removeAllChecked();
            L.LAY_CHECKED = true;
            layui.event.call(this, i, "checkbox(" + B + ")", {checked: true, data: L, type: "one"})
        });
        b.on("checkbox(" + E + ")", function (O) {
            var N = O.elem.checked;
            var Q = e(O.elem);
            var L = Q.next(".layui-form-checkbox");
            if (!N && L.hasClass("ew-form-indeterminate")) {
                N = true;
                Q.prop("checked", N);
                Q.data("indeterminate", "false");
                L.addClass("layui-form-checked");
                L.removeClass("ew-form-indeterminate")
            }
            var P = q(J.data, O.value, J.tree);
            P.LAY_CHECKED = N;
            var M = Q.parentsUntil("tr").parent();
            if (P[J.tree.childName] && P[J.tree.childName].length > 0) {
                A.checkSubCB(M, N)
            }
            var K = parseInt(M.data("indent"));
            M.prevAll("tr").each(function () {
                var R = parseInt(e(this).data("indent"));
                if (R < K) {
                    A.checkParentCB(e(this));
                    K = R
                }
            });
            A.checkChooseAllCB();
            layui.event.call(this, i, "checkbox(" + B + ")", {checked: N, data: P, type: "one"})
        });
        b.on("checkbox(" + G + ")", function (M) {
            var L = M.elem.checked;
            var N = e(M.elem);
            var K = N.next(".layui-form-checkbox");
            if (!J.data || J.data.length <= 0) {
                N.prop("checked", false);
                N.data("indeterminate", "false");
                K.removeClass("layui-form-checked ew-form-indeterminate");
                return
            }
            if (!L && K.hasClass("ew-form-indeterminate")) {
                L = true;
                N.prop("checked", L);
                N.data("indeterminate", "false");
                K.addClass("layui-form-checked");
                K.removeClass("ew-form-indeterminate")
            }
            layui.event.call(this, i, "checkbox(" + B + ")", {checked: L, data: undefined, type: "all"});
            A.checkSubCB(I.children("tbody"), L)
        });
        y.off("click.row").on("click.row", "tr", function () {
            layui.event.call(this, i, "row(" + B + ")", D.call(this, {}))
        });
        y.off("dblclick.rowDouble").on("dblclick.rowDouble", "tr", function () {
            layui.event.call(this, i, "rowDouble(" + B + ")", D.call(this, {}))
        });
        y.off("click.cell").on("click.cell", "td", function (O) {
            var L = e(this);
            var R = L.data("type");
            if (R == "checkbox" || R == "radio") {
                layui.stope(O);
                return
            }
            var U = L.data("edit");
            var T = L.data("field");
            if (U) {
                layui.stope(O);
                if (y.find(".ew-tree-table-edit").length > 0) {
                    return
                }
                var N = L.data("index");
                var Q = L.children(".ew-tree-table-indent").length;
                var K = L.parent().data("id");
                var P = q(J.data, K, J.tree);
                if ("text" == U || "number" == U) {
                    var S = e('<input type="' + U + '" class="layui-input ew-tree-table-edit"/>');
                    S[0].value = P[T];
                    L.append(S);
                    S.focus();
                    S.blur(function () {
                        var W = e(this).val();
                        if (W == P[T]) {
                            e(this).remove();
                            return
                        }
                        var V = layui.event.call(this, i, "edit(" + B + ")", D.call(this, {value: W, field: T}));
                        if (V == false) {
                            e(this).addClass("layui-form-danger");
                            e(this).focus()
                        } else {
                            P[T] = W;
                            A.renderBodyTd(P, Q, N, L)
                        }
                    })
                } else {
                    console.error("不支持的单元格编辑类型:" + U)
                }
            } else {
                var M = layui.event.call(this, i, "cell(" + B + ")", D.call(this, {td: L, field: T}));
                if (M == false) {
                    layui.stope(O)
                }
            }
        });
        y.off("dblclick.cellDouble").on("dblclick.cellDouble", "td", function (O) {
            var P = e(this);
            var L = P.data("type");
            if (L == "checkbox" || L == "radio") {
                layui.stope(O);
                return
            }
            var M = P.data("edit");
            var N = P.data("field");
            if (M) {
                layui.stope(O)
            } else {
                var K = layui.event.call(this, i, "cellDouble(" + B + ")", D.call(this, {td: P, field: N}));
                if (K == false) {
                    layui.stope(O)
                }
            }
        })
    };
    s.prototype.getComponents = function () {
        var A = e(this.options.elem).next();
        var D = A.children(".ew-tree-table-group");
        var E = D.children(".ew-tree-table-box");
        var I = E.children(".layui-table");
        var B = D.children(".ew-tree-table-head").children(".layui-table");
        var F = E.children(".ew-tree-table-empty");
        var y = E.children(".ew-tree-table-loading");
        var z = A.attr("lay-filter");
        var C = "ew_tb_checkbox_" + z;
        var H = "ew_tb_radio_" + z;
        var G = "ew_tb_choose_all_" + z;
        return {
            $view: A,
            $group: D,
            $tbBox: E,
            $table: I,
            $headTb: B,
            $tbEmpty: F,
            $tbLoading: y,
            tbFilter: z,
            checkboxFilter: C,
            radioFilter: H,
            cbAllFilter: G
        }
    };
    s.prototype.renderBody = function (C, F, z) {
        var G = this.options;
        var B = G.tree;
        F || (F = 0);
        var y = "";
        for (var D = 0; D < C.length; D++) {
            var E = C[D];
            y += this.renderBodyTr(E, F, z);
            var A = E[B.childName];
            if (A && A.length > 0) {
                y += this.renderBody(A, F + 1, !E[B.openName])
            }
        }
        return y
    };
    s.prototype.renderBodyTr = function (G, H, A, E) {
        var J = this.options;
        var I = J.cols;
        var C = J.tree;
        H || (H = 0);
        var z = "";
        var F = k(G, C);
        if (E) {
            E.data("pid", G[C.pidName] || "");
            E.data("have-child", F);
            E.data("indent", H);
            E.removeClass("ew-tree-table-loading")
        } else {
            var y = "";
            if (F && G[C.openName]) {
                y += "ew-tree-table-open"
            }
            if (A) {
                y += "ew-tree-tb-hide"
            }
            z += '<tr class="' + y + '" data-id="' + G[C.idName] + '"';
            z += ' data-pid="' + (G[C.pidName] || "") + '" data-have-child="' + F + '"';
            z += ' data-indent="' + H + '">'
        }
        for (var D = 0; D < I.length; D++) {
            var B;
            if (E) {
                B = E.children("td").eq(D)
            }
            z += this.renderBodyTd(G, H, D, B)
        }
        z += "</tr>";
        return z
    };
    s.prototype.renderBodyTd = function (I, J, H, A) {
        var N = this.options;
        var B = N.cols[H];
        var D = N.tree;
        var E = this.getComponents();
        var K = E.checkboxFilter;
        var M = E.radioFilter;
        J || (J = 0);
        var L = "";
        if (B.type == "numbers") {
            L += '<span class="ew-tree-table-numbers"></span>'
        } else {
            if (B.type == "checkbox") {
                var z = 'name="' + K + '" lay-filter="' + K + '" value="' + I[D.idName] + '"';
                z += I.LAY_CHECKED ? ' checked="checked"' : "";
                L += '<input type="checkbox" lay-skin="primary" ' + z + ' class="ew-tree-table-checkbox" />'
            } else {
                if (B.type == "radio") {
                    var z = 'name="' + M + '" lay-filter="' + M + '" value="' + I[D.idName] + '"';
                    z += I.LAY_CHECKED ? ' checked="checked"' : "";
                    L += '<input type="radio" ' + z + ' class="ew-tree-table-radio" />'
                } else {
                    if (B.templet) {
                        if (typeof B.templet == "function") {
                            L += B.templet(I)
                        } else {
                            if (typeof B.templet == "string") {
                                c(e(B.templet).html()).render(I, function (O) {
                                    L += O
                                })
                            }
                        }
                    } else {
                        if (B.toolbar) {
                            c(e(B.toolbar).html()).render(I, function (O) {
                                L += O
                            })
                        } else {
                            if (B.field && I[B.field] != undefined && I[B.field] != null) {
                                L += I[B.field]
                            }
                        }
                    }
                }
            }
        }
        var G = "";
        if (H == D.iconIndex) {
            for (var C = 0; C < J; C++) {
                G += '<span class="ew-tree-table-indent"></span>'
            }
            G += '<span class="ew-tree-pack">';
            var F = k(I, D);
            G += ('<i class="layui-icon ew-tree-table-arrow ' + (F ? "" : "ew-tree-table-arrow-hide") + " " + (N.tree.arrowType || "") + '"></i>');
            G += D.getIcon(I);
            if (N.tree.onlyIconControl) {
                G += "</span>";
                G += ("<span>" + L + "</span>")
            } else {
                G += ("<span>" + L + "</span>");
                G += "</span>"
            }
        } else {
            G += L
        }
        if (A && B.type != "numbers") {
            A.html(G)
        }
        var y = '<td data-index="' + H + '" ';
        B.field && (y += (' data-field="' + B.field + '"'));
        B.edit && (y += (' data-edit="' + B.edit + '"'));
        B.type && (y += (' data-type="' + B.type + '"'));
        B.align && (y += (' align="' + B.align + '"'));
        B.style && (y += (' style="' + B.style + '"'));
        y += '">';
        y += (G + "</td>");
        return y
    };
    s.prototype.renderBodyAsync = function (E, C) {
        var B = this;
        var z = this.options;
        var A = this.getComponents();
        var y = A.$tbEmpty;
        var D = A.$tbLoading;
        if (C) {
            C.addClass("ew-tree-table-loading");
            C.children("td").children(".ew-tree-pack").children(".ew-tree-table-arrow").addClass("layui-anim layui-anim-rotate layui-anim-loop")
        } else {
            if (z.data && z.data.length > 0) {
                D.addClass("ew-loading-float")
            }
            D.show()
        }
        z.reqData(E, function (F) {
            B.renderBodyData(F, E, C);
            if (C) {
                C.removeClass("ew-tree-table-loading");
                C.children("td").children(".ew-tree-pack").children(".ew-tree-table-arrow").removeClass("layui-anim layui-anim-rotate layui-anim-loop")
            } else {
                D.hide();
                D.removeClass("ew-loading-float")
            }
            if ((!F || F.length == 0) && !C) {
                y.show()
            }
        })
    };
    s.prototype.renderBodyData = function (A, G, B) {
        var E = this;
        var I = this.options;
        var C = this.getComponents();
        var F = C.$view;
        var H = C.$table;
        var D = C.tbFilter;
        v(A, I.tree, G);
        if (G == undefined) {
            I.data = A
        } else {
            G[I.tree.childName] = A
        }
        var z;
        if (B) {
            z = parseInt(B.data("indent")) + 1
        }
        var y = this.renderBody(A, z);
        if (B) {
            B.nextAll("tr").each(function () {
                if (parseInt(e(this).data("indent")) <= (z - 1)) {
                    return false
                }
                e(this).remove()
            });
            B.after(y);
            B.addClass("ew-tree-table-open")
        } else {
            H.children("tbody").html(y)
        }
        b.render(null, D);
        this.renderNumberCol();
        this.checkIndeterminateCB();
        if (B) {
            this.checkParentCB(B);
            B.prevAll("tr").each(function () {
                var J = parseInt(e(this).data("indent"));
                if (J < (z - 1)) {
                    E.checkParentCB(e(this));
                    z = J + 1
                }
            })
        }
        this.checkChooseAllCB();
        d(F)
    };
    s.prototype.checkSubCB = function (E, D) {
        var C = this;
        var B = this.getComponents();
        var z = B.checkboxFilter;
        var y = -1, A;
        if (E.is("tbody")) {
            A = E.children("tr")
        } else {
            y = parseInt(E.data("indent"));
            A = E.nextAll("tr")
        }
        A.each(function () {
            if (parseInt(e(this).data("indent")) <= y) {
                return false
            }
            var F = e(this).children("td").children('input[name="' + z + '"]');
            F.prop("checked", D);
            if (D) {
                F.data("indeterminate", "false");
                F.next(".layui-form-checkbox").addClass("layui-form-checked")
            } else {
                F.data("indeterminate", "false");
                F.next(".layui-form-checkbox").removeClass("layui-form-checked ew-form-indeterminate")
            }
            C.update(e(this).data("id"), {LAY_CHECKED: D})
        })
    };
    s.prototype.checkParentCB = function (D) {
        var C = this;
        var B = this.getComponents();
        var z = B.checkboxFilter;
        var y = parseInt(D.data("indent"));
        var E = 0, A = 0;
        D.nextAll("tr").each(function () {
            if (parseInt(e(this).data("indent")) <= y) {
                return false
            }
            var G = e(this).children("td").children('input[name="' + z + '"]');
            if (G.prop("checked")) {
                E++
            } else {
                A++
            }
        });
        var F = D.children("td").children('input[name="' + z + '"]');
        if (E > 0 && A == 0) {
            F.prop("checked", true);
            F.data("indeterminate", "false");
            F.next(".layui-form-checkbox").addClass("layui-form-checked");
            F.next(".layui-form-checkbox").removeClass("ew-form-indeterminate");
            C.update(D.data("id"), {LAY_CHECKED: true})
        } else {
            if (E == 0 && A > 0) {
                F.prop("checked", false);
                F.data("indeterminate", "false");
                F.next(".layui-form-checkbox").removeClass("layui-form-checked ew-form-indeterminate");
                C.update(D.data("id"), {LAY_CHECKED: false})
            } else {
                if (E > 0 && A > 0) {
                    F.prop("checked", true);
                    F.data("indeterminate", "true");
                    F.next(".layui-form-checkbox").addClass("layui-form-checked ew-form-indeterminate");
                    C.update(D.data("id"), {LAY_CHECKED: true})
                }
            }
        }
    };
    s.prototype.checkChooseAllCB = function () {
        var C = this.getComponents();
        var B = C.cbAllFilter;
        var z = C.checkboxFilter;
        var y = C.$table.children("tbody");
        var D = 0, A = 0;
        y.children("tr").each(function () {
            var F = e(this).children("td").children('input[name="' + z + '"]');
            if (F.prop("checked")) {
                D++
            } else {
                A++
            }
        });
        var E = e('input[lay-filter="' + B + '"]');
        if (D > 0 && A == 0) {
            E.prop("checked", true);
            E.data("indeterminate", "false");
            E.next(".layui-form-checkbox").addClass("layui-form-checked");
            E.next(".layui-form-checkbox").removeClass("ew-form-indeterminate")
        } else {
            if ((D == 0 && A > 0) || (D == 0 && A == 0)) {
                E.prop("checked", false);
                E.data("indeterminate", "false");
                E.next(".layui-form-checkbox").removeClass("layui-form-checked ew-form-indeterminate")
            } else {
                if (D > 0 && A > 0) {
                    E.prop("checked", true);
                    E.data("indeterminate", "true");
                    E.next(".layui-form-checkbox").addClass("layui-form-checked ew-form-indeterminate")
                }
            }
        }
    };
    s.prototype.renderNumberCol = function () {
        var z = this.getComponents();
        var y = z.$table.children("tbody");
        y.children("tr").each(function (A) {
            e(this).children("td").children(".ew-tree-table-numbers").text(A + 1)
        })
    };
    s.prototype.checkIndeterminateCB = function () {
        var z = this.getComponents();
        var y = z.checkboxFilter;
        e('input[lay-filter="' + y + '"]').each(function () {
            var A = e(this);
            if (A.data("indeterminate") == "true" && A.prop("checked")) {
                A.next(".layui-form-checkbox").addClass("ew-form-indeterminate")
            }
        })
    };
    s.prototype.filterData = function (C) {
        var E = this.getComponents();
        var B = E.$table.children("tbody").children("tr");
        if (typeof C == "string") {
            var z = C;
            C = [];
            B.each(function () {
                var F = e(this).data("id");
                e(this).children("td").each(function () {
                    if (e(this).text().indexOf(z) != -1) {
                        C.push(F);
                        return false
                    }
                })
            })
        }
        B.addClass("ew-tree-table-filter-hide");
        for (var A = 0; A < C.length; A++) {
            var D = B.filter('[data-id="' + C[A] + '"]');
            D.removeClass("ew-tree-table-filter-hide");
            var y = parseInt(D.data("indent"));
            D.prevAll("tr").each(function () {
                var F = parseInt(e(this).data("indent"));
                if (F < y) {
                    e(this).removeClass("ew-tree-table-filter-hide");
                    if (!e(this).hasClass("ew-tree-table-open")) {
                        l(e(this))
                    }
                    y = F
                }
            })
        }
    };
    s.prototype.clearFilter = function () {
        var z = this.getComponents();
        var y = z.$table.children("tbody").children("tr");
        y.removeClass("ew-tree-table-filter-hide")
    };
    s.prototype.expand = function (C, z) {
        var B = this.getComponents();
        var A = B.$table.children("tbody").children('tr[data-id="' + C + '"]');
        if (!A.hasClass("ew-tree-table-open")) {
            A.children("td").children(".ew-tree-pack").trigger("click")
        }
        if (z == false) {
            return
        }
        var y = parseInt(A.data("indent"));
        A.prevAll("tr").each(function () {
            var D = parseInt(e(this).data("indent"));
            if (D < y) {
                if (!e(this).hasClass("ew-tree-table-open")) {
                    e(this).children("td").children(".ew-tree-pack").trigger("click")
                }
                y = D
            }
        })
    };
    s.prototype.fold = function (C, z) {
        var B = this.getComponents();
        var A = B.$table.children("tbody").children('tr[data-id="' + C + '"]');
        if (A.hasClass("ew-tree-table-open")) {
            A.children("td").children(".ew-tree-pack").trigger("click")
        }
        if (z == false) {
            return
        }
        var y = parseInt(A.data("indent"));
        A.prevAll("tr").each(function () {
            var D = parseInt(e(this).data("indent"));
            if (D < y) {
                if (e(this).hasClass("ew-tree-table-open")) {
                    e(this).children("td").children(".ew-tree-pack").trigger("click")
                }
                y = D
            }
        })
    };
    s.prototype.expandAll = function () {
        var A = this;
        var z = this.getComponents();
        var y = z.$table.children("tbody").children("tr");
        y.each(function () {
            A.expand(e(this).data("id"), false)
        })
    };
    s.prototype.foldAll = function () {
        var A = this;
        var z = this.getComponents();
        var y = z.$table.children("tbody").children("tr");
        y.each(function () {
            A.fold(e(this).data("id"), false)
        })
    };
    s.prototype.getData = function () {
        return this.options.data
    };
    s.prototype.reload = function (y) {
        a.render(e.extend(this.options, y))
    };
    s.prototype.update = function (A, y) {
        var z = q(this.getData(), A, this.options.tree);
        e.extend(z, y)
    };
    s.prototype.del = function (y) {
        t(this.getData(), y, this.options.tree)
    };
    s.prototype.checkStatus = function () {
        var B = this;
        var A = this.getComponents();
        var G = A.$table;
        var E = A.checkboxFilter;
        var F = A.radioFilter;
        var C = [];
        var z = G.find('input[name="' + F + '"]');
        if (z.length > 0) {
            var y = z.filter(":checked").val();
            var D = q(this.getData(), y, this.options.tree);
            if (D) {
                C.push(D)
            }
        } else {
            G.find('input[name="' + E + '"]:checked').each(function () {
                var I = e(this).val();
                var H = q(B.getData(), I, B.options.tree);
                if (H) {
                    C.push(H)
                }
            })
        }
        return C
    };
    s.prototype.setChecked = function (B) {
        var C = this.getComponents();
        var z = C.$table;
        var A = C.checkboxFilter;
        var D = C.radioFilter;
        var y = z.find('input[name="' + D + '"]');
        if (y.length > 0) {
            y.each(function () {
                if (B[B.length - 1] == e(this).val()) {
                    e(this).next(".layui-form-radio").trigger("click");
                    return false
                }
            })
        } else {
            z.find('input[name="' + A + '"]').each(function () {
                var J = e(this);
                var H = J.val();
                var F = J.next(".layui-form-checkbox");
                for (var E = 0; E < B.length; E++) {
                    if (H == B[E]) {
                        var G = J.prop("checked");
                        var I = F.hasClass("ew-form-indeterminate");
                        if (!G || I) {
                            F.trigger("click")
                        }
                    }
                }
            })
        }
    };
    s.prototype.removeAllChecked = function () {
        var A = this.getComponents();
        var y = A.$table;
        var z = A.checkboxFilter;
        this.checkSubCB(y.children("tbody"), false)
    };
    s.prototype.refresh = function (D, B) {
        var A = this.getComponents();
        var y = A.$table;
        var C, z;
        if (D != undefined) {
            C = q(this.getData(), D, this.options.tree);
            z = y.children("tbody").children('tr[data-id="' + D + '"]')
        }
        if (B) {
            A.$tbLoading.addClass("ew-loading-float");
            A.$tbLoading.show();
            this.renderBodyData(B, C, z);
            A.$tbLoading.hide();
            A.$tbLoading.removeClass("ew-loading-float")
        } else {
            this.renderBodyAsync(C, z)
        }
    };

    function f(z) {
        var B = "<tr>";
        for (var A = 0; A < z.cols.length; A++) {
            var y = z.cols[A];
            B += '<td data-index="' + A + '" ';
            y.align && (B += ' align="' + y.align + '"');
            B += " >";
            if (y.type == "checkbox") {
                B += z.getAllChooseBox()
            } else {
                B += (y.title || "")
            }
            if (!y.unresize && "checkbox" != y.type && "radio" != y.type && "numbers" != y.type && "space" != y.type) {
                B += '<span class="ew-tb-resize"></span>'
            }
            B += "</td>"
        }
        B += "</tr>";
        return B
    }

    function g(z) {
        var B = "<colgroup>";
        for (var A = 0; A < z.cols.length; A++) {
            var y = z.cols[A];
            B += "<col ";
            if (y.width) {
                B += 'width="' + y.width + '"'
            } else {
                if (y.type == "space") {
                    B += 'width="15"'
                } else {
                    if (y.type == "numbers") {
                        B += 'width="40"'
                    } else {
                        if (y.type == "checkbox" || y.type == "radio") {
                            B += 'width="48"'
                        }
                    }
                }
            }
            B += " />"
        }
        B += "</colgroup>";
        return B
    }

    function m(z) {
        var C = 0, B = 0, D = true;
        for (var A = 0; A < z.cols.length; A++) {
            var y = z.cols[A];
            if (y.type == "space") {
                C += 15;
                B += 15
            } else {
                if (y.type == "numbers") {
                    C += 40;
                    B += 40
                } else {
                    if (y.type == "checkbox" || y.type == "radio") {
                        C += 48;
                        B += 48
                    } else {
                        if (!y.width || /\d+%$/.test(y.width)) {
                            D = false;
                            if (this.cellMinWidth != undefined) {
                                C += z.cellMinWidth;
                                B += z.cellMinWidth
                            }
                        } else {
                            C += y.width;
                            B += y.width
                        }
                    }
                }
            }
        }
        return {minWidth: C, width: B, setWidth: D}
    }

    function j(y) {
        var A = e(y.elem).next().attr("lay-filter");
        var z = "ew_tb_choose_all_" + A;
        return '<input type="checkbox" lay-filter="' + z + '" lay-skin="primary" class="ew-tree-table-checkbox"/>'
    }

    function h(z, y) {
        if (k(z, y)) {
            return '<i class="ew-tree-icon layui-icon layui-icon-layer"></i>'
        } else {
            return '<i class="ew-tree-icon layui-icon layui-icon-file"></i>'
        }
    }

    function l(A) {
        var y = parseInt(A.data("indent"));
        var z = A.hasClass("ew-tree-table-open");
        if (z) {
            A.removeClass("ew-tree-table-open");
            A.nextAll("tr").each(function () {
                if (parseInt(e(this).data("indent")) <= y) {
                    return false
                }
                e(this).addClass("ew-tree-tb-hide")
            })
        } else {
            A.addClass("ew-tree-table-open");
            var B;
            A.nextAll("tr").each(function () {
                var C = parseInt(e(this).data("indent"));
                if (C <= y) {
                    return false
                }
                if (B != undefined && C > B) {
                    return true
                }
                e(this).removeClass("ew-tree-tb-hide");
                if (!e(this).hasClass("ew-tree-table-open")) {
                    B = parseInt(e(this).data("indent"))
                } else {
                    B = undefined
                }
            })
        }
        d(A.parent().parent().parent().parent().parent())
    }

    function d(B) {
        var z = B.children(".ew-tree-table-group");
        var y = z.children(".ew-tree-table-box");
        var A = y.width() - y.prop("clientWidth");
        if (A > 0) {
            if (!(r.ie && r.ie < 9)) {
                A = A - 0.48
            }
            z.children(".ew-tree-table-head").css("padding-right", A)
        } else {
            z.children(".ew-tree-table-head").css("padding-right", 0)
        }
    }

    e(window).resize(function () {
        e(".ew-tree-table").each(function () {
            d(e(this));
            var z = e(this).children(".ew-tree-table-group").children(".ew-tree-table-box");
            var y = z.attr("ew-tree-full");
            if (y && r.ie && r.ie < 10) {
                z.css("height", o() - y)
            }
        })
    });

    function k(A, z) {
        var y = false;
        if (A[z.haveChildName] != undefined) {
            y = A[z.haveChildName];
            y = y == true || y == "true"
        } else {
            if (A[z.childName]) {
                y = A[z.childName].length > 0
            }
        }
        return y
    }

    function v(B, z, A) {
        for (var y = 0; y < B.length; y++) {
            if (A) {
                B[y][z.pidName] = A[z.idName]
            }
            if (B[y][z.childName] && B[y][z.childName].length > 0) {
                v(B[y][z.childName], z, B[y])
            }
        }
    }

    function q(A, C, z) {
        for (var y = 0; y < A.length; y++) {
            if (A[y][z.idName] == C) {
                return A[y]
            }
            if (A[y][z.childName] && A[y][z.childName].length > 0) {
                var B = q(A[y][z.childName], C, z);
                if (B != undefined) {
                    return B
                }
            }
        }
    }

    function t(B, C, A) {
        for (var z = 0; z < B.length; z++) {
            if (B[z][A.idName] == C) {
                B.splice(z, 1);
                return true
            }
            if (B[z][A.childName] && B[z][A.childName].length > 0) {
                var y = t(B[z][A.childName], C, A);
                if (y) {
                    return true
                }
            }
        }
    }

    function u(B) {
        var C = [];
        for (var A = 0; A < B.length; A++) {
            var y = false;
            for (var z = 0; z < B.length; z++) {
                if (A != z && B[z].id == B[A].pId) {
                    y = true
                }
            }
            if (!y) {
                C.push(B[A].pId)
            }
        }
        return C
    }

    function p(z, A) {
        if (n(A) == "Array") {
            for (var y = 0; y < A.length; y++) {
                if (z == A[y]) {
                    return true
                }
            }
        } else {
            return z == A
        }
        return false
    }

    function n(y) {
        if (y === null) {
            return "Null"
        }
        if (y === undefined) {
            return "Undefined"
        }
        return Object.prototype.toString.call(y).slice(8, -1)
    }

    function o() {
        return document.documentElement.clientHeight || document.body.clientHeight
    }

    var a = {
        render: function (y) {
            return new s(y)
        }, on: function (y, z) {
            return layui.onevent.call(this, i, y, z)
        }, pidToChildren: function (E, z, F, y, C) {
            y || (y = "children");
            var D = [];
            for (var B = 0; B < E.length; B++) {
                (C == undefined) && (C = u(E));
                if (p(E[B][F], C)) {
                    var A = this.pidToChildren(E, z, F, y, E[B][z]);
                    (A.length > 0) && (E[B][y] = A);
                    D.push(E[B])
                }
            }
            return D
        }
    };
    x("treeTable", a)
});